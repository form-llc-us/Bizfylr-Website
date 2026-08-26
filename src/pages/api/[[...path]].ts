import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";

import type { NextApiRequest, NextApiResponse } from "next";
import { PaymentOrderStatus } from "@prisma/client";
import { ZodError, z } from "zod";

import { persistBlogImage, UploadValidationError } from "@/lib/blog/storage";
import {
  analyzeBlogContent,
  prepareBlogPayload
} from "@/lib/blog/service";
import {
  BlogConflictError,
  BlogNotFoundError,
  BlogValidationError,
  saveBlogPost,
  updateBlogStatus
} from "@/lib/blog/repository";
import {
  blogAnalyzeSchema,
  blogPostInputSchema,
  blogPublishSchema
} from "@/lib/blog/validations";
import { validateCoupon } from "@/lib/coupons";
import { cleanupOperationalRecords, processEmailOutboxBatch } from "@/lib/email-outbox";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminAuthErrorMessage,
  getAdminSessionMaxAge,
  isAdminAuthConfigured,
  revokeAdminSessionToken,
  verifyAdminCredentials
} from "@/lib/auth";
import { BODY_LIMITS, readJsonRequest, readRawRequestBody, RequestBodyError } from "@/lib/http/body";
import {
  calculatePaymentBreakdown,
  createRazorpayOrder,
  fetchRazorpayOrderDetails,
  fetchRazorpayPaymentDetails,
  findRecentRazorpayOrderByReceipt,
  getPublicRazorpayKey,
  getTaxNote,
  hasRazorpayApiCredentials,
  isPaymentConfigured,
  PAYMENT_MODEL,
  PaymentValidationError,
  toMinorUnits,
  validatePaymentPayload
} from "@/lib/payment";
import { consumeRateLimit, getClientIp, logServerError } from "@/lib/server";
import {
  processRazorpayWebhookPayload,
  RazorpayWebhookPayloadError,
  verifyRazorpayWebhookSignature
} from "@/lib/razorpay/webhook";
import { isDatabaseConfigured } from "@/lib/prisma";
import {
  createContactSubmission,
  createLeadSubmission,
  completePaymentIntentProviderOrder,
  createNewsletterSubscriber,
  createOrClaimPaymentIntent,
  findPaymentOrderByProviderOrderId,
  markPaymentIntentProviderFailure,
  markPaymentOrderFromWebhook,
  markPaymentOrderVerified,
  PaymentIdempotencyConflictError
} from "@/lib/submissions";
import { contactSchema, leadSchema, newsletterSchema, paymentCurrencies, serviceOptions } from "@/lib/validations";

export const config = {
  api: {
    bodyParser: false
  }
};

const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 8;

const validateCouponSchema = z.object({
  code: z.string().trim().min(1, "Enter a coupon code."),
  amount: z.coerce.number().finite("Please enter a valid payment amount."),
  currency: z.enum(paymentCurrencies),
  billingCountry: z.string().trim().optional(),
  service: z.enum(serviceOptions).optional()
});

function sendJson(response: NextApiResponse, status: number, payload: unknown) {
  return response.status(status).json(payload);
}

function methodNotAllowed(response: NextApiResponse, allowed: readonly string[] = ["POST"]) {
  response.setHeader("Allow", allowed.join(", "));
  return sendJson(response, 405, { message: "Method not allowed." });
}

function getPath(request: NextApiRequest) {
  const path = request.query.path;
  return (Array.isArray(path) ? path : path ? [path] : []).join("/");
}

function getClientIpFromRequest(request: NextApiRequest) {
  return getClientIp(request);
}

function getHeader(request: NextApiRequest, name: string) {
  const value = request.headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

function isSecureRequest(request: NextApiRequest) {
  const forwardedProto = getHeader(request, "x-forwarded-proto");

  if (forwardedProto) {
    return forwardedProto.split(",")[0]?.trim() === "https";
  }

  return Boolean((request.socket as typeof request.socket & { encrypted?: boolean }).encrypted);
}

function formatCookie(input: {
  httpOnly?: boolean;
  maxAge: number;
  name: string;
  path: string;
  sameSite: "Lax" | "Strict";
  secure?: boolean;
  value: string;
}) {
  const parts = [
    `${input.name}=${encodeURIComponent(input.value)}`,
    `Max-Age=${input.maxAge}`,
    `Path=${input.path}`,
    `SameSite=${input.sameSite}`
  ];

  if (input.httpOnly) {
    parts.push("HttpOnly");
  }

  if (input.secure) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

async function readJson(request: NextApiRequest, limitBytes = BODY_LIMITS.standardJson) {
  return readJsonRequest(request, limitBytes);
}

function toHeaders(request: NextApiRequest) {
  const headers = new Headers();

  for (const [key, value] of Object.entries(request.headers)) {
    if (typeof value === "string") {
      headers.set(key, value);
    } else if (Array.isArray(value)) {
      headers.set(key, value.join(", "));
    }
  }

  return headers;
}

function toWebRequest(request: NextApiRequest, body: Buffer) {
  const arrayBuffer = body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength) as ArrayBuffer;
  const init: RequestInit = {
    body: arrayBuffer,
    headers: toHeaders(request),
    method: request.method
  };

  return new Request("http://localhost/api/upload", init);
}

function sendRouteError(
  response: NextApiResponse,
  context: string,
  error: unknown,
  fallbackMessage: string
) {
  if (error instanceof RequestBodyError) {
    return sendJson(response, error.statusCode, { message: error.message });
  }
  logServerError(context, error);
  return sendJson(response, 500, { message: fallbackMessage });
}

function setRateLimitResponse(response: NextApiResponse, retryAfterSeconds: number) {
  response.setHeader("Retry-After", String(retryAfterSeconds));
  return sendJson(response, 429, { message: "Too many requests. Please try again later." });
}

function hasValidAdminCsrf(request: NextApiRequest) {
  if (getHeader(request, "x-bizfylr-csrf") !== "1") {
    return false;
  }
  const origin = getHeader(request, "origin");
  if (!origin) {
    return true;
  }
  const host = getHeader(request, "x-forwarded-host")?.split(",")[0]?.trim() || getHeader(request, "host");
  try {
    return Boolean(host) && new URL(origin).host === host;
  } catch {
    return false;
  }
}

async function revalidateBlog(response: NextApiResponse, slug?: string) {
  const paths = ["/blog", "/sitemap.xml", "/rss.xml"];

  if (slug) {
    paths.push(`/blog/${slug}`);
  }

  await Promise.all(
    paths.map(async (path) => {
      try {
        await response.revalidate(path);
      } catch {
        // Revalidation is best-effort in the Pages API compatibility layer.
      }
    })
  );
}

function timingSafeHexEqual(received: string, expected: string) {
  const receivedBuffer = Buffer.from(received, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer);
}

async function handleBlogAnalyze(request: NextApiRequest, response: NextApiResponse) {
  try {
    const payload = await readJson(request, BODY_LIMITS.blogJson);
    const result = blogAnalyzeSchema.safeParse(payload);

    if (!result.success) {
      return sendJson(response, 400, { message: result.error.issues[0]?.message ?? "Invalid payload." });
    }

    const analysis = await analyzeBlogContent({
      title: result.data.title,
      slug: result.data.slug,
      excerpt: result.data.excerpt,
      contentJson: result.data.contentJson as never,
      renderedHtml: result.data.renderedHtml,
      focusKeyword: result.data.focusKeyword,
      metaDescription: result.data.metaDescription,
      categories: result.data.categories,
      tags: result.data.tags
    });

    return sendJson(response, 200, analysis);
  } catch (error) {
    return sendRouteError(response, "api/blog/analyze", error, "Unable to analyze content.");
  }
}

async function handleBlogSave(request: NextApiRequest, response: NextApiResponse, mode: "create" | "update") {
  try {
    const payload = await readJson(request, BODY_LIMITS.blogJson);
    const result = blogPostInputSchema.safeParse(payload);

    if (!result.success) {
      return sendJson(response, 400, { message: result.error.issues[0]?.message ?? "Invalid payload." });
    }

    const { payload: preparedPayload } = await prepareBlogPayload({
      ...result.data,
      contentJson: result.data.contentJson as never
    });

    const post = await saveBlogPost(preparedPayload, mode);
    await revalidateBlog(response, post.slug);

    return sendJson(response, mode === "create" ? 201 : 200, {
      message:
        mode === "create"
          ? post.status === "PUBLISHED"
            ? "Blog post published successfully."
            : "Draft saved successfully."
          : post.status === "PUBLISHED"
            ? "Blog post updated and published."
            : "Draft updated successfully.",
      post
    });
  } catch (error) {
    if (error instanceof BlogConflictError) {
      return sendJson(response, 409, { message: error.message });
    }
    if (error instanceof BlogNotFoundError) {
      return sendJson(response, 404, { message: error.message });
    }
    if (error instanceof BlogValidationError) {
      return sendJson(response, 422, { message: error.message });
    }
    return sendRouteError(
      response,
      `api/blog/${mode}`,
      error,
      `Unable to ${mode === "create" ? "create" : "update"} the blog post right now.`
    );
  }
}

async function handleBlogPublish(request: NextApiRequest, response: NextApiResponse) {
  try {
    const payload = await readJson(request, BODY_LIMITS.standardJson);
    const result = blogPublishSchema.safeParse(payload);

    if (!result.success) {
      return sendJson(response, 400, { message: result.error.issues[0]?.message ?? "Invalid payload." });
    }

    const post = await updateBlogStatus(result.data.slug, result.data.status);
    await revalidateBlog(response, post.slug);

    return sendJson(response, 200, {
      message: `Post status updated to ${post.status}.`,
      post
    });
  } catch (error) {
    if (error instanceof BlogNotFoundError) {
      return sendJson(response, 404, { message: error.message });
    }
    return sendRouteError(response, "api/blog/publish", error, "Unable to update publish status right now.");
  }
}

async function handleBlogUpload(request: NextApiRequest, response: NextApiResponse) {
  try {
    const body = await readRawRequestBody(request, {
      limitBytes: BODY_LIMITS.imageUpload,
      allowedContentTypes: ["multipart/form-data"]
    });
    const formData = await toWebRequest(request, body).formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return sendJson(response, 400, { message: "Please upload an image file." });
    }

    const image = await persistBlogImage(file);
    return sendJson(response, 200, image);
  } catch (error) {
    if (error instanceof UploadValidationError) {
      return sendJson(response, 400, { message: error.message });
    }
    return sendRouteError(response, "api/blog/upload", error, "Unable to upload image right now.");
  }
}

async function handleBlogAuthLogin(request: NextApiRequest, response: NextApiResponse) {
  if (!isAdminAuthConfigured()) {
    return sendJson(response, 503, { message: getAdminAuthErrorMessage() });
  }

  if (!hasValidAdminCsrf(request)) {
    return sendJson(response, 403, { message: "Request validation failed." });
  }

  const payload = await readJson(request);
  const parsed = z.object({ username: z.string().max(200), password: z.string().max(500) }).safeParse(payload);
  if (!parsed.success) {
    return sendJson(response, 400, { message: "Invalid login request." });
  }
  const ip = getClientIpFromRequest(request);
  const [ipLimit, accountLimit] = await Promise.all([
    consumeRateLimit({ namespace: "admin-login-ip", identifier: ip, limit: 6, windowMs: 15 * 60_000 }),
    consumeRateLimit({ namespace: "admin-login-account", identifier: parsed.data.username, limit: 6, windowMs: 15 * 60_000 })
  ]);
  if (ipLimit.limited || accountLimit.limited) {
    return setRateLimitResponse(response, Math.max(ipLimit.retryAfterSeconds, accountLimit.retryAfterSeconds));
  }

  const payloadRecord: { password?: unknown; username?: unknown } = parsed.data;
  const username = typeof payloadRecord.username === "string" ? payloadRecord.username : "";
  const password = typeof payloadRecord.password === "string" ? payloadRecord.password : "";

  if (!verifyAdminCredentials(username, password)) {
    return sendJson(response, 401, { message: "Invalid admin username or password." });
  }

  const token = await createAdminSessionToken({ ipAddress: ip, userAgent: getHeader(request, "user-agent") });

  if (!token) {
    return sendJson(response, 500, { message: "Unable to create an admin session." });
  }

  response.setHeader(
    "Set-Cookie",
    formatCookie({
      name: ADMIN_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      maxAge: getAdminSessionMaxAge(),
      path: "/",
      sameSite: "Strict",
      secure: isSecureRequest(request)
    })
  );

  return sendJson(response, 200, { message: "Signed in." });
}

async function handleBlogAuthLogout(request: NextApiRequest, response: NextApiResponse) {
  if (!hasValidAdminCsrf(request)) {
    return sendJson(response, 403, { message: "Request validation failed." });
  }
  await revokeAdminSessionToken(request.cookies[ADMIN_SESSION_COOKIE] ?? null);
  response.setHeader(
    "Set-Cookie",
    formatCookie({
      name: ADMIN_SESSION_COOKIE,
      value: "",
      httpOnly: true,
      maxAge: 0,
      path: "/",
      sameSite: "Strict",
      secure: isSecureRequest(request)
    })
  );

  return sendJson(response, 200, { message: "Signed out." });
}

async function handleContact(request: NextApiRequest, response: NextApiResponse) {
  try {
    if (!isDatabaseConfigured()) {
      return sendJson(response, 503, {
        message: "Submissions are temporarily unavailable. Please contact support directly."
      });
    }

    const ip = getClientIpFromRequest(request);

    const rateLimit = await consumeRateLimit({ namespace: "contact", identifier: ip, limit: RATE_LIMIT_MAX, windowMs: RATE_LIMIT_WINDOW });
    if (rateLimit.limited) {
      return setRateLimitResponse(response, rateLimit.retryAfterSeconds);
    }

    const payload = await readJson(request);
    const isContactPage = typeof payload === "object" && payload !== null &&
      "source" in payload && payload.source === "contact-page";
    const result = (isContactPage ? contactSchema : leadSchema).safeParse(payload);

    if (!result.success) {
      return sendJson(response, 400, {
        message: result.error.issues[0]?.message ?? "Invalid form payload."
      });
    }

    if (result.data.website) {
      return sendJson(response, 400, { message: "Spam signal detected." });
    }

    const userAgent = getHeader(request, "user-agent") ?? undefined;

    if (isContactPage) {
      await createContactSubmission({
        values: contactSchema.parse(payload),
        source: "contact-page",
        ipAddress: ip,
        userAgent
      });

    } else {
      await createLeadSubmission({
        values: leadSchema.parse(payload),
        source: "lead-capture",
        ipAddress: ip,
        userAgent
      });

    }

    return sendJson(response, 200, {
      message: "Submission received. Our team will review it and follow up shortly.",
      receivedAt: new Date().toISOString()
    });
  } catch (error) {
    return sendRouteError(response, "api/contact", error, "Unable to process the request right now. Please try again shortly.");
  }
}

async function handleNewsletter(request: NextApiRequest, response: NextApiResponse) {
  try {
    if (!isDatabaseConfigured()) {
      return sendJson(response, 503, {
        message: "Subscriptions are temporarily unavailable right now."
      });
    }

    const ip = getClientIpFromRequest(request);

    const payload = await readJson(request);
    const result = newsletterSchema.safeParse(payload);

    if (!result.success) {
      return sendJson(response, 400, { message: "Please enter a valid email address." });
    }

    if (result.data.website) {
      return sendJson(response, 400, { message: "Unable to process the subscription." });
    }

    const [ipLimit, emailLimit] = await Promise.all([
      consumeRateLimit({ namespace: "newsletter-ip", identifier: ip, limit: 5, windowMs: 60_000 }),
      consumeRateLimit({ namespace: "newsletter-email", identifier: result.data.email, limit: 3, windowMs: 60 * 60_000 })
    ]);
    if (ipLimit.limited || emailLimit.limited) {
      return setRateLimitResponse(response, Math.max(ipLimit.retryAfterSeconds, emailLimit.retryAfterSeconds));
    }

    await createNewsletterSubscriber({
      values: result.data,
      ipAddress: ip,
      userAgent: getHeader(request, "user-agent") ?? undefined
    });

    return sendJson(response, 200, { message: "If this address was eligible, the subscription has been saved." });
  } catch (error) {
    return sendRouteError(response, "api/newsletter", error, "Unable to process the subscription right now.");
  }
}

async function handlePaymentCreateOrder(request: NextApiRequest, response: NextApiResponse) {
  try {
    const payload = await readJson(request);
    const data = validatePaymentPayload(payload);
    const ip = getClientIpFromRequest(request);
    const [ipLimit, emailLimit] = await Promise.all([
      consumeRateLimit({ namespace: "payment-order-ip", identifier: ip, limit: 5, windowMs: 10 * 60_000 }),
      consumeRateLimit({ namespace: "payment-order-email", identifier: data.email, limit: 4, windowMs: 10 * 60_000 })
    ]);
    if (ipLimit.limited || emailLimit.limited) {
      return setRateLimitResponse(response, Math.max(ipLimit.retryAfterSeconds, emailLimit.retryAfterSeconds));
    }

    const breakdown = calculatePaymentBreakdown({
      amount: data.amount,
      currency: data.currency,
      couponCode: data.couponCode,
      billingCountry: data.billingCountry,
      billingState: data.billingState,
      billingGstin: data.billingGstin,
      service: data.service
    });
    const taxNote = getTaxNote(data.currency, data.billingCountry);

    if (!isDatabaseConfigured()) {
      return sendJson(response, 503, {
        paymentEnabled: false,
        message: "Payments are temporarily unavailable. Please contact support."
      });
    }

    if (!isPaymentConfigured()) {
      return sendJson(response, 501, {
        paymentEnabled: false,
        message: "Payments are temporarily unavailable. Please contact support.",
        breakdown
      });
    }

    const suppliedIdempotencyKey = getHeader(request, "idempotency-key")?.trim();
    const idempotencyKey = suppliedIdempotencyKey || randomUUID();
    if (!/^[A-Za-z0-9._:-]{16,128}$/.test(idempotencyKey)) {
      return sendJson(response, 400, { message: "Invalid payment idempotency key." });
    }
    const requestHash = createHash("sha256").update(JSON.stringify({ data, breakdown })).digest("hex");
    const receipt = `bizfylr_${createHash("sha256").update(idempotencyKey).digest("hex").slice(0, 18)}`;
    const intent = await createOrClaimPaymentIntent({
      values: data,
      breakdown,
      taxNote,
      receipt,
      idempotencyKey,
      requestHash
    });

    let paymentOrder = intent.order;
    if (intent.shouldCreateProviderOrder) {
      try {
        const reconciledOrder = intent.order.providerCreateAttempts > 1
          ? await findRecentRazorpayOrderByReceipt({
              receipt,
              amountMinor: breakdown.totalAmountMinor,
              currency: data.currency,
              createdAfter: intent.order.createdAt
            })
          : null;
        const providerOrder = reconciledOrder ?? await createRazorpayOrder({
            amountMinor: breakdown.totalAmountMinor,
            currency: data.currency,
            receipt,
            notes: {
              paymentModel: PAYMENT_MODEL,
              service: data.service,
              billingCountry: data.billingCountry,
              billingEmail: data.email,
              couponCode: breakdown.couponCode ?? ""
            }
          });
        if (providerOrder.amount !== breakdown.totalAmountMinor || providerOrder.currency !== data.currency) {
          throw new Error("Razorpay order details did not match the validated payment breakdown.");
        }
        paymentOrder = await completePaymentIntentProviderOrder({
          orderId: intent.order.id,
          providerOrderId: providerOrder.id,
          receipt: providerOrder.receipt
        });
      } catch (error) {
        await markPaymentIntentProviderFailure(intent.order.id, error);
        throw error;
      }
    } else if (!paymentOrder.providerOrderId) {
      return sendJson(response, 409, {
        paymentEnabled: false,
        idempotencyKey,
        message: "This payment order is still being initialized. Retry with the same idempotency key."
      });
    }

    return sendJson(response, 200, {
      paymentEnabled: true,
      paymentModel: PAYMENT_MODEL,
      orderId: paymentOrder.id,
      razorpayOrderId: paymentOrder.providerOrderId,
      idempotencyKey,
      amountMinor: breakdown.totalAmountMinor,
      currency: data.currency,
      razorpayKeyId: getPublicRazorpayKey(),
      breakdown,
      companyName: "Bizfylr",
      description: `${data.service} payment`,
      prefill: {
        name: data.name,
        email: data.email,
        contact: data.phone
      },
      notes: {
        service: data.service,
        billingCountry: data.billingCountry,
        couponCode: breakdown.couponCode ?? ""
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return sendJson(response, 400, { message: error.issues[0]?.message ?? "Invalid payment details." });
    }

    if (error instanceof PaymentValidationError) {
      return sendJson(response, 400, { message: error.message || "Invalid payment details." });
    }

    if (error instanceof PaymentIdempotencyConflictError) {
      return sendJson(response, 409, { message: error.message });
    }

    return sendRouteError(response, "api/payment/create-order", error, "Unable to initialize payment right now.");
  }
}

async function handlePaymentValidateCoupon(request: NextApiRequest, response: NextApiResponse) {
  try {
    const payload = await readJson(request);
    const data = validateCouponSchema.parse(payload);
    const subtotalMinor = toMinorUnits(data.amount, data.currency);
    const result = validateCoupon({
      code: data.code,
      currency: data.currency,
      subtotalMinor,
      service: data.service
    });

    return sendJson(response, 200, {
      valid: result.valid,
      code: result.code,
      discountMinor: result.discountMinor,
      message: result.message
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return sendJson(response, 400, { message: error.issues[0]?.message ?? "Invalid coupon request." });
    }

    if (error instanceof PaymentValidationError) {
      return sendJson(response, 400, { message: error.message });
    }

    logServerError("api/payment/validate-coupon", error);
    return sendJson(response, 500, { message: "Unable to validate the coupon right now." });
  }
}

async function handlePaymentVerify(request: NextApiRequest, response: NextApiResponse) {
  try {
    const payload = await readJson(request);
    const result = z
      .object({
        razorpay_order_id: z.string().min(1),
        razorpay_payment_id: z.string().min(1),
        razorpay_signature: z.string().min(1)
      })
      .safeParse(payload);

    if (!result.success) {
      return sendJson(response, 400, { verified: false, message: "Invalid verification payload." });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return sendJson(response, 501, {
        verified: false,
        message: "Payment verification is currently unavailable."
      });
    }

    const expected = createHmac("sha256", secret)
      .update(`${result.data.razorpay_order_id}|${result.data.razorpay_payment_id}`)
      .digest("hex");

    if (!timingSafeHexEqual(result.data.razorpay_signature, expected)) {
      return sendJson(response, 400, {
        verified: false,
        message: "Payment verification failed."
      });
    }

    const storedOrder = await findPaymentOrderByProviderOrderId(result.data.razorpay_order_id);

    if (!storedOrder) {
      return sendJson(response, 404, {
        verified: false,
        message: "Payment verification failed."
      });
    }

    if (!hasRazorpayApiCredentials()) {
      return sendJson(response, 503, {
        verified: false,
        message: "Payment verification is currently unavailable."
      });
    }

    const [payment, order] = await Promise.all([
      fetchRazorpayPaymentDetails(result.data.razorpay_payment_id),
      fetchRazorpayOrderDetails(result.data.razorpay_order_id)
    ]);

    const expectedAmountMinor = storedOrder.totalAmountMinor ?? storedOrder.amountMinor;
    const amountMatches = payment.amount === expectedAmountMinor && order.amount === expectedAmountMinor;
    const currencyMatches = payment.currency === storedOrder.currency && order.currency === storedOrder.currency;
    const orderMatches =
      payment.order_id === storedOrder.providerOrderId && order.id === storedOrder.providerOrderId;

    if (!amountMatches || !currencyMatches || !orderMatches) {
      return sendJson(response, 400, {
        verified: false,
        message: "Payment verification failed."
      });
    }

    if (payment.status === "failed") {
      await markPaymentOrderFromWebhook({
        providerOrderId: storedOrder.providerOrderId ?? undefined,
        providerPaymentId: payment.id,
        status: PaymentOrderStatus.FAILED,
        failureReason: "Razorpay reported the payment as failed during verification."
      });

      return sendJson(response, 400, {
        verified: false,
        message: "Payment verification failed."
      });
    }

    if (payment.status === "authorized") {
      return sendJson(response, 409, {
        verified: false,
        message: "Payment is authorized and awaiting capture confirmation."
      });
    }

    if (payment.status !== "captured") {
      return sendJson(response, 400, {
        verified: false,
        message: "Payment verification failed."
      });
    }

    await markPaymentOrderVerified({
      providerOrderId: result.data.razorpay_order_id,
      providerPaymentId: result.data.razorpay_payment_id,
      providerSignature: result.data.razorpay_signature
    });

    return sendJson(response, 200, {
      verified: true,
      message: "Payment verified successfully."
    });
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return sendJson(response, error.statusCode, { verified: false, message: error.message });
    }
    logServerError("api/payment/verify", error);
    return sendJson(response, 500, { verified: false, message: "Unable to verify payment." });
  }
}

async function handlePaymentWebhook(request: NextApiRequest, response: NextApiResponse) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret) {
    return sendJson(response, 501, {
      received: false,
      message: "Webhook secret is not configured. Webhook processing is disabled."
    });
  }

  try {
    const signature = getHeader(request, "x-razorpay-signature");
    const body = await readRawRequestBody(request, {
      limitBytes: BODY_LIMITS.webhook,
      allowedContentTypes: ["application/json", "application/*+json"]
    });

    if (!signature) {
      return sendJson(response, 400, { received: false, message: "Missing webhook signature." });
    }

    if (!verifyRazorpayWebhookSignature(body, signature, secret)) {
      return sendJson(response, 400, { received: false, message: "Invalid webhook signature." });
    }

    const result = await processRazorpayWebhookPayload(body.toString("utf8"));
    return sendJson(response, result.statusCode, result.body);
  } catch (error) {
    if (error instanceof RazorpayWebhookPayloadError) {
      return sendJson(response, 400, { received: false, message: error.message });
    }

    if (error instanceof RequestBodyError) {
      return sendJson(response, error.statusCode, { received: false, message: error.message });
    }

    logServerError("api/payment/webhook", error);
    return sendJson(response, 500, { received: false, message: "Unable to process webhook." });
  }
}

async function handleEmailOutboxWorker(request: NextApiRequest, response: NextApiResponse) {
  const secret = process.env.CRON_SECRET?.trim();
  const authorization = getHeader(request, "authorization") ?? "";
  const received = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!secret || secret.length < 32) {
    return sendJson(response, 503, { message: "Email worker authentication is not configured." });
  }
  if (!timingSafeHexEqual(received, secret)) {
    return sendJson(response, 401, { message: "Unauthorized." });
  }

  const result = await processEmailOutboxBatch(25);
  const cleanup = await cleanupOperationalRecords();
  return sendJson(response, 200, { processed: result, cleanup });
}

export default async function apiHandler(request: NextApiRequest, response: NextApiResponse) {
  const path = getPath(request);

  const routeMethods: Record<string, readonly string[]> = {
    "blog/analyze": ["POST"],
    "blog/create": ["POST"],
    "blog/update": ["PUT"],
    "blog/publish": ["PATCH"],
    "blog/upload": ["POST"],
    "blog-auth/login": ["POST"],
    "blog-auth/logout": ["POST"],
    contact: ["POST"],
    newsletter: ["POST"],
    "payment/create": ["POST"],
    "payment/create-order": ["POST"],
    "payment/validate-coupon": ["POST"],
    "payment/verify": ["POST"],
    "payment/webhook": ["POST"],
    "internal/email-outbox/process": ["POST"]
  };
  const allowed = routeMethods[path];
  if (!allowed) {
    return sendJson(response, 404, { message: "API route not found." });
  }
  if (!request.method || !allowed.includes(request.method)) {
    return methodNotAllowed(response, allowed);
  }
  if (path.startsWith("blog/") && !hasValidAdminCsrf(request)) {
    return sendJson(response, 403, { message: "Request validation failed." });
  }

  try {
    switch (path) {
      case "blog/analyze": return await handleBlogAnalyze(request, response);
      case "blog/create": return await handleBlogSave(request, response, "create");
      case "blog/update": return await handleBlogSave(request, response, "update");
      case "blog/publish": return await handleBlogPublish(request, response);
      case "blog/upload": return await handleBlogUpload(request, response);
      case "blog-auth/login": return await handleBlogAuthLogin(request, response);
      case "blog-auth/logout": return await handleBlogAuthLogout(request, response);
      case "contact": return await handleContact(request, response);
      case "newsletter": return await handleNewsletter(request, response);
      case "payment/create":
      case "payment/create-order": return await handlePaymentCreateOrder(request, response);
      case "payment/validate-coupon": return await handlePaymentValidateCoupon(request, response);
      case "payment/verify": return await handlePaymentVerify(request, response);
      case "payment/webhook": return await handlePaymentWebhook(request, response);
      case "internal/email-outbox/process": return await handleEmailOutboxWorker(request, response);
      default: return sendJson(response, 404, { message: "API route not found." });
    }
  } catch (error) {
    return sendRouteError(response, `api/${path}`, error, "Unable to process the request.");
  }
}
