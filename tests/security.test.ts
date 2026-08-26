import { createHmac } from "node:crypto";
import { Readable } from "node:stream";
import { describe, expect, it } from "vitest";

import { isAdminSessionActive } from "@/lib/auth";
import { isAllowedBlogImageUrl } from "@/lib/blog/images";
import { isAllowedCmsUrl, sanitizeBlogHtml } from "@/lib/blog/parser";
import { ensureUniqueSlug } from "@/lib/blog/slug";
import { validateCoupon } from "@/lib/coupons";
import { createEmailDeduplicationKey } from "@/lib/email-outbox";
import { readJsonRequest, readRawRequestBody } from "@/lib/http/body";
import { serializeJsonForHtml } from "@/lib/json";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay/webhook";
import { calculatePaymentBreakdown, validatePaymentPayload } from "@/lib/payment";
import { calculateRateLimitResult, deriveClientIp } from "@/lib/server";
import { nextPaymentAttemptStatus, nextPaymentStatus } from "@/lib/submissions";

function request(chunks: readonly (string | Buffer)[], headers: Record<string, string> = {}) {
  return Object.assign(Readable.from(chunks), { headers });
}

describe("bounded request bodies", () => {
  it("rejects an excessive declared content length", async () => {
    await expect(readRawRequestBody(request([], { "content-length": "1000" }), { limitBytes: 10 }))
      .rejects.toMatchObject({ statusCode: 413 });
  });

  it("stops a chunked body that exceeds the real limit", async () => {
    await expect(readRawRequestBody(request(["12345", "67890"]), { limitBytes: 8 }))
      .rejects.toMatchObject({ statusCode: 413 });
  });

  it("returns controlled errors for malformed JSON and media types", async () => {
    await expect(readJsonRequest(request(["{"], { "content-type": "application/json" }), 100))
      .rejects.toMatchObject({ statusCode: 400 });
    await expect(readJsonRequest(request(["{}"], { "content-type": "text/plain" }), 100))
      .rejects.toMatchObject({ statusCode: 415 });
  });
});

describe("injection defenses", () => {
  it("escapes JSON-LD script terminators and separators", () => {
    const serialized = serializeJsonForHtml({ title: "</script><script>alert(1)</script>\u2028&" });
    expect(serialized).not.toContain("</script>");
    expect(serialized).toContain("\\u003c/script\\u003e");
    expect(serialized).toContain("\\u2028");
    expect(serialized).toContain("\\u0026");
  });

  it("preserves approved YouTube embeds with constrained attributes", () => {
    const html = sanitizeBlogHtml('<iframe src="https://www.youtube-nocookie.com/embed/abc" onload="alert(1)"></iframe>');
    expect(html).toContain("youtube-nocookie.com/embed/abc");
    expect(html).toContain("sandbox=");
    expect(html).not.toContain("onload");
  });

  it.each([
    ['<iframe src="https://evil.example/embed/x"></iframe>', "iframe"],
    ['<script>alert(1)</script><p>safe</p>', "script"],
    ['<img src="/x" onerror="alert(1)">', "onerror"],
    ['<a href="javascript:alert(1)">bad</a>', "javascript:"],
    ['<div><svg><script>alert(1)</script></svg></div>', "script"]
  ])("removes malicious CMS markup", (input, forbidden) => {
    expect(sanitizeBlogHtml(input).toLowerCase()).not.toContain(forbidden);
  });

  it("allows HTTPS and relative CMS links while rejecting insecure schemes", () => {
    expect(isAllowedCmsUrl("https://example.com/path", "link")).toBe(true);
    expect(isAllowedCmsUrl("/blog/post", "link")).toBe(true);
    expect(isAllowedCmsUrl("http://example.com", "link")).toBe(false);
    expect(isAllowedCmsUrl("javascript:alert(1)", "link")).toBe(false);
    expect(isAllowedCmsUrl("data:text/html,bad", "media")).toBe(false);
    expect(sanitizeBlogHtml('<a href="http://example.com">bad</a>')).not.toContain("href=");
  });
});

describe("payment and operational invariants", () => {
  it("verifies Razorpay HMAC signatures in constant-time-safe code", () => {
    const body = Buffer.from('{"id":"evt_1"}');
    const secret = "test-secret";
    const signature = createHmac("sha256", secret).update(body).digest("hex");
    expect(verifyRazorpayWebhookSignature(body, signature, secret)).toBe(true);
    expect(verifyRazorpayWebhookSignature(body, "0".repeat(64), secret)).toBe(false);
  });

  it("keeps captured and verified payment states monotonic", () => {
    expect(nextPaymentStatus("PAID", "FAILED")).toBe("PAID");
    expect(nextPaymentStatus("FAILED", "PAID")).toBe("PAID");
    expect(nextPaymentStatus("VERIFIED", "PAID")).toBe("VERIFIED");
    expect(nextPaymentAttemptStatus("CAPTURED", "FAILED")).toBe("CAPTURED");
  });

  it("calculates explicit fixed and percentage coupons by currency", () => {
    const usd = validateCoupon({ code: "WELCOME25", currency: "USD", subtotalMinor: 10_000, service: "Business Expansion" });
    const inr = validateCoupon({ code: "WELCOME25", currency: "INR", subtotalMinor: 10_000, service: "Business Expansion" });
    const percentage = validateCoupon({ code: "BIZFYLR10", currency: "USD", subtotalMinor: 10_000, service: "Business Expansion" });
    expect(usd.discountMinor).toBe(2500);
    expect(inr.discountMinor).toBe(2500);
    expect(percentage.discountMinor).toBe(1000);
  });

  it("enforces the bounded custom-invoice model and server-calculated totals", () => {
    const payload = {
      service: "Business Expansion" as const,
      amount: 100,
      currency: "USD" as const,
      name: "Test Customer",
      email: "test@example.com",
      phone: "+15555550123",
      billingCountry: "United States",
      billingAddress: "123 Test Street"
    };
    expect(validatePaymentPayload(payload)).toMatchObject({ amount: 100, currency: "USD" });
    expect(() => validatePaymentPayload({ ...payload, amount: 10001 })).toThrow();
    expect(() => validatePaymentPayload({ ...payload, currency: "EUR" })).toThrow();
    expect(() => validatePaymentPayload({ ...payload, totalAmountMinor: 1 })).toThrow();
    expect(calculatePaymentBreakdown(payload).totalAmountMinor).toBe(10_000);
  });

  it("generates deterministic email keys and slug suffixes", () => {
    expect(createEmailDeduplicationKey([" Payment ", "ABC", "Customer"])).toBe("payment:abc:customer");
    expect(ensureUniqueSlug("launch", ["launch", "launch-2"])).toBe("launch-3");
  });
});

describe("session, proxy, image, and rate-limit policy", () => {
  it("enforces server-side session expiration and revocation", () => {
    const now = new Date("2026-07-10T12:00:00Z");
    expect(isAdminSessionActive({ expiresAt: new Date("2026-07-10T13:00:00Z"), revokedAt: null }, now)).toBe(true);
    expect(isAdminSessionActive({ expiresAt: now, revokedAt: null }, now)).toBe(false);
    expect(isAdminSessionActive({ expiresAt: new Date("2026-07-10T13:00:00Z"), revokedAt: now }, now)).toBe(false);
  });

  it("uses a configured proxy hop instead of blindly taking the first forwarded value", () => {
    expect(deriveClientIp({ forwardedFor: "198.51.100.2, 10.0.0.4", remoteAddress: "127.0.0.1", trustProxy: true, trustedProxyHops: 1 })).toBe("10.0.0.4");
    expect(deriveClientIp({ forwardedFor: "198.51.100.2", remoteAddress: "127.0.0.1", trustProxy: false, trustedProxyHops: 1 })).toBe("127.0.0.1");
  });

  it("returns bounded retry metadata", () => {
    const now = new Date("2026-07-10T12:00:00Z");
    expect(calculateRateLimitResult({ count: 6, limit: 5, now, expiresAt: new Date(now.getTime() + 30_000) }))
      .toEqual({ limited: true, remaining: 0, retryAfterSeconds: 30 });
  });

  it("allows only deployable blog image sources", () => {
    expect(isAllowedBlogImageUrl("/uploads/blog/2026/07/a.webp")).toBe(true);
    expect(isAllowedBlogImageUrl("https://bizfylr.com/assets/blog/a.webp")).toBe(true);
    expect(isAllowedBlogImageUrl("javascript:alert(1)")).toBe(false);
    expect(isAllowedBlogImageUrl("https://evil.example/a.webp")).toBe(false);
  });
});
