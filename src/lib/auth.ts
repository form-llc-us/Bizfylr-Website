import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

import { isDatabaseConfigured, prisma } from "@/lib/prisma";

const PROTECTED_ROUTE_MESSAGE = "Admin access is not configured.";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;

export const ADMIN_SESSION_COOKIE = "bizfylr_admin_session";

function constantTimeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  const maxLength = Math.max(leftBuffer.length, rightBuffer.length, 1);
  const paddedLeft = Buffer.alloc(maxLength);
  const paddedRight = Buffer.alloc(maxLength);
  leftBuffer.copy(paddedLeft);
  rightBuffer.copy(paddedRight);
  return timingSafeEqual(paddedLeft, paddedRight) && leftBuffer.length === rightBuffer.length;
}

function normalizeConfiguredCredential(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  if (trimmed.length >= 2) {
    const first = trimmed[0];
    const last = trimmed[trimmed.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return trimmed.slice(1, -1).replace(/\\([#$"'\\])/g, "$1");
    }
  }
  return trimmed.replace(/\\([#$"'\\])/g, "$1");
}

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getAdminCredentials() {
  return {
    username: normalizeConfiguredCredential(process.env.BLOG_ADMIN_USERNAME),
    password: normalizeConfiguredCredential(process.env.BLOG_ADMIN_PASSWORD)
  };
}

export function isAdminAuthConfigured() {
  const { username, password } = getAdminCredentials();
  return Boolean(username && password && isDatabaseConfigured());
}

export function verifyAdminCredentials(inputUsername: string, inputPassword: string) {
  const { username, password } = getAdminCredentials();
  return Boolean(username && password) &&
    constantTimeEqual(inputUsername, username) &&
    constantTimeEqual(inputPassword, password);
}

export function getAdminSessionMaxAge() {
  return ADMIN_SESSION_TTL_SECONDS;
}

export async function createAdminSessionToken(input?: { ipAddress?: string; userAgent?: string }) {
  if (!isAdminAuthConfigured()) {
    return "";
  }

  const token = randomBytes(32).toString("base64url");
  await prisma.adminSession.create({
    data: {
      tokenHash: hashSessionToken(token),
      expiresAt: new Date(Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000),
      ipAddress: input?.ipAddress,
      userAgent: input?.userAgent?.slice(0, 1000)
    }
  });
  return token;
}

export async function verifyAdminSessionToken(token: null | string) {
  if (!token || !isAdminAuthConfigured()) {
    return false;
  }

  const now = new Date();
  const session = await prisma.adminSession.findUnique({ where: { tokenHash: hashSessionToken(token) } });
  if (!session || !isAdminSessionActive(session, now)) {
    return false;
  }

  if (now.getTime() - session.lastUsedAt.getTime() > 5 * 60 * 1000) {
    await prisma.adminSession.updateMany({
      where: { id: session.id, revokedAt: null, expiresAt: { gt: now } },
      data: { lastUsedAt: now }
    });
  }
  return true;
}

export function isAdminSessionActive(
  session: { expiresAt: Date; revokedAt: Date | null },
  now = new Date()
) {
  return !session.revokedAt && session.expiresAt > now;
}

export async function revokeAdminSessionToken(token: null | string) {
  if (!token || !isDatabaseConfigured()) {
    return;
  }
  await prisma.adminSession.updateMany({
    where: { tokenHash: hashSessionToken(token), revokedAt: null },
    data: { revokedAt: new Date() }
  });
}

export function getAdminAuthErrorMessage() {
  return PROTECTED_ROUTE_MESSAGE;
}
