import { createHash } from "node:crypto";
import { isIP } from "node:net";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export function logServerError(context: string, error: unknown) {
  const safeError = error instanceof Error
    ? { name: error.name, message: error.message, code: "code" in error ? String(error.code) : undefined }
    : { name: "UnknownError", message: "An unknown error occurred." };
  console.error(`[${context}]`, safeError);
}

export function deriveClientIp(input: {
  forwardedFor?: string;
  remoteAddress?: string;
  trustProxy: boolean;
  trustedProxyHops: number;
}) {
  if (input.trustProxy && input.forwardedFor) {
    const chain = input.forwardedFor.split(",").map((value) => value.trim()).filter(Boolean);
    const index = Math.max(0, chain.length - Math.max(1, input.trustedProxyHops));
    const candidate = chain[index];
    if (candidate && isIP(candidate)) {
      return candidate;
    }
  }

  const remote = input.remoteAddress?.replace(/^::ffff:/, "");
  return remote && isIP(remote) ? remote : "unknown";
}

export function getClientIp(input: {
  headers: { [key: string]: string | string[] | undefined };
  socket: { remoteAddress?: string };
}) {
  const forwarded = input.headers["x-forwarded-for"];
  const forwardedFor = Array.isArray(forwarded) ? forwarded.join(",") : forwarded;
  const trustedProxyHops = Number.parseInt(process.env.TRUSTED_PROXY_HOPS ?? "1", 10);
  return deriveClientIp({
    forwardedFor,
    remoteAddress: input.socket.remoteAddress,
    trustProxy: process.env.TRUST_PROXY_HEADERS?.trim().toLowerCase() === "true",
    trustedProxyHops: Number.isFinite(trustedProxyHops) ? trustedProxyHops : 1
  });
}

export function calculateRateLimitResult(input: {
  count: number;
  limit: number;
  expiresAt: Date;
  now: Date;
}) {
  return {
    limited: input.count > input.limit,
    remaining: Math.max(0, input.limit - input.count),
    retryAfterSeconds: Math.max(1, Math.ceil((input.expiresAt.getTime() - input.now.getTime()) / 1000))
  };
}

export async function consumeRateLimit(input: {
  namespace: string;
  identifier: string;
  limit: number;
  windowMs: number;
}) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + input.windowMs);
  const key = createHash("sha256")
    .update(`${input.namespace}:${input.identifier.trim().toLowerCase()}`)
    .digest("hex");

  await prisma.$transaction(async (tx) => {
    const reset = await tx.rateLimitBucket.updateMany({
      where: { key, expiresAt: { lte: now } },
      data: { count: 1, windowStart: now, expiresAt }
    });

    if (reset.count > 0) {
      return;
    }

    const incremented = await tx.rateLimitBucket.updateMany({
      where: { key, expiresAt: { gt: now } },
      data: { count: { increment: 1 } }
    });

    if (incremented.count > 0) {
      return;
    }

    try {
      await tx.rateLimitBucket.create({ data: { key, count: 1, windowStart: now, expiresAt } });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") {
        throw error;
      }
      await tx.rateLimitBucket.update({ where: { key }, data: { count: { increment: 1 } } });
    }
  });

  const bucket = await prisma.rateLimitBucket.findUniqueOrThrow({ where: { key } });
  return calculateRateLimitResult({ count: bucket.count, limit: input.limit, expiresAt: bucket.expiresAt, now });
}
