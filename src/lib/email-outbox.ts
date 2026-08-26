import { createHash } from "node:crypto";
import { EmailOutboxStatus, type PaymentOrder, type Prisma } from "@prisma/client";
import { z } from "zod";

import {
  contactAdminTemplate,
  contactClientTemplate,
  newsletterAdminTemplate,
  newsletterClientTemplate,
  paymentFailedAdminTemplate,
  paymentFailedClientTemplate,
  paymentOrderCreatedAdminTemplate,
  paymentVerifiedAdminTemplate,
  paymentVerifiedClientTemplate
} from "@/lib/email-templates";
import { sendEmail } from "@/lib/email";
import { formatMinorCurrency } from "@/lib/payment";
import { prisma } from "@/lib/prisma";
import { logServerError } from "@/lib/server";

const MAX_EMAIL_ATTEMPTS = 5;
const STALE_LOCK_MS = 15 * 60 * 1000;

type EmailTemplateResult = { subject: string; html: string; text: string };
type EmailOutboxMessage = {
  deduplicationKey: string;
  template: string;
  recipientType: "admin" | "customer";
  recipient: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

const storedPayloadSchema = z.object({
  html: z.string(),
  text: z.string(),
  replyTo: z.string().email().optional()
});

function adminRecipients() {
  return (process.env.ADMIN_NOTIFICATION_EMAIL ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

function adminMessages(baseKey: string, template: string, content: EmailTemplateResult) {
  return adminRecipients().map((recipient) => ({
    deduplicationKey: `${baseKey}:admin:${createHash("sha256").update(recipient).digest("hex").slice(0, 16)}`,
    template,
    recipientType: "admin" as const,
    recipient,
    subject: content.subject,
    html: content.html,
    text: content.text,
    replyTo: process.env.SUPPORT_REPLY_TO_EMAIL?.trim() || undefined
  }));
}

function customerMessage(input: {
  baseKey: string;
  recipient: string;
  template: string;
  content: EmailTemplateResult;
}): EmailOutboxMessage {
  return {
    deduplicationKey: `${input.baseKey}:customer`,
    template: input.template,
    recipientType: "customer",
    recipient: input.recipient.trim().toLowerCase(),
    subject: input.content.subject,
    html: input.content.html,
    text: input.content.text
  };
}

export function createEmailDeduplicationKey(parts: readonly string[]) {
  return parts.map((part) => part.trim().toLowerCase()).join(":");
}

export async function enqueueEmailMessages(
  tx: Prisma.TransactionClient,
  messages: readonly EmailOutboxMessage[]
) {
  if (messages.length === 0) {
    return;
  }

  await tx.emailOutbox.createMany({
    data: messages.map((message) => ({
      deduplicationKey: message.deduplicationKey,
      template: message.template,
      recipientType: message.recipientType,
      recipient: message.recipient,
      subject: message.subject,
      payloadJson: {
        html: message.html,
        text: message.text,
        ...(message.replyTo ? { replyTo: message.replyTo } : {})
      }
    })),
    skipDuplicates: true
  });
}

export function contactOutboxMessages(input: {
  submissionId: string;
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  service: string;
  message: string;
  source?: string;
  submittedAt: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  const baseKey = createEmailDeduplicationKey(["contact", input.submissionId]);
  const admin = contactAdminTemplate(input);
  const client = contactClientTemplate({ name: input.name, service: input.service });
  return [
    ...adminMessages(baseKey, "contact-admin", admin),
    customerMessage({ baseKey, recipient: input.email, template: "contact-customer", content: client })
  ];
}

export function newsletterOutboxMessages(input: {
  subscriberId: string;
  email: string;
  source?: string;
  submittedAt: string;
}) {
  const baseKey = createEmailDeduplicationKey(["newsletter", input.subscriberId]);
  return [
    ...adminMessages(baseKey, "newsletter-admin", newsletterAdminTemplate(input)),
    customerMessage({
      baseKey,
      recipient: input.email,
      template: "newsletter-welcome",
      content: newsletterClientTemplate()
    })
  ];
}

function paymentDisplay(order: PaymentOrder) {
  const currency = order.currency as "INR" | "USD";
  return {
    subtotal: formatMinorCurrency(order.subtotalMinor ?? order.amountMinor, currency),
    discount: formatMinorCurrency(order.discountMinor, currency),
    gst: formatMinorCurrency(order.gstAmountMinor, currency),
    total: formatMinorCurrency(order.totalAmountMinor ?? order.amountMinor, currency)
  };
}

export function paymentOrderCreatedOutboxMessages(order: PaymentOrder) {
  const display = paymentDisplay(order);
  const content = paymentOrderCreatedAdminTemplate({
    localOrderId: order.id,
    razorpayOrderId: order.providerOrderId ?? "Not available",
    service: order.service,
    name: order.billingName,
    email: order.billingEmail,
    phone: order.billingPhone,
    currency: order.currency,
    subtotal: display.subtotal,
    discount: display.discount,
    couponCode: order.couponCode,
    gst: display.gst,
    total: display.total,
    billingCountry: order.billingCountry ?? order.country,
    billingState: order.billingState,
    billingGstin: order.billingGstin,
    billingCompany: order.billingCompany
  });
  return adminMessages(createEmailDeduplicationKey(["payment-order", order.id]), "payment-order-admin", content);
}

export function paymentSuccessOutboxMessages(order: PaymentOrder) {
  const display = paymentDisplay(order);
  const baseKey = createEmailDeduplicationKey(["payment-success", order.id]);
  const admin = paymentVerifiedAdminTemplate({
    localOrderId: order.id,
    razorpayOrderId: order.providerOrderId ?? "Not available",
    razorpayPaymentId: order.providerPaymentId ?? "Not available",
    service: order.service,
    name: order.billingName,
    email: order.billingEmail,
    phone: order.billingPhone,
    currency: order.currency,
    total: display.total,
    discount: display.discount,
    couponCode: order.couponCode,
    gst: display.gst,
    verifiedAt: (order.verifiedAt ?? order.paidAt ?? new Date()).toISOString()
  });
  const client = paymentVerifiedClientTemplate({
    name: order.billingName,
    service: order.service,
    currency: order.currency,
    total: display.total,
    discount: display.discount,
    couponCode: order.couponCode,
    gst: display.gst,
    razorpayPaymentId: order.providerPaymentId ?? "Not available"
  });
  return [
    ...adminMessages(baseKey, "payment-success-admin", admin),
    customerMessage({ baseKey, recipient: order.billingEmail, template: "payment-success-customer", content: client })
  ];
}

export function paymentFailureOutboxMessages(input: {
  order: PaymentOrder;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  reason: string;
}) {
  const attemptKey = input.razorpayPaymentId ?? "unknown";
  const baseKey = createEmailDeduplicationKey(["payment-failure", input.order.id, attemptKey]);
  const admin = paymentFailedAdminTemplate({
    localOrderId: input.order.id,
    razorpayOrderId: input.razorpayOrderId ?? input.order.providerOrderId,
    razorpayPaymentId: input.razorpayPaymentId,
    clientName: input.order.billingName,
    clientEmail: input.order.billingEmail,
    reason: input.reason,
    occurredAt: new Date().toISOString()
  });
  const client = paymentFailedClientTemplate({
    name: input.order.billingName,
    service: input.order.service,
    reason: input.reason,
    razorpayPaymentId: input.razorpayPaymentId
  });
  return [
    ...adminMessages(baseKey, "payment-failure-admin", admin),
    customerMessage({ baseKey, recipient: input.order.billingEmail, template: "payment-failure-customer", content: client })
  ];
}

function retryDelayMs(attemptCount: number) {
  return Math.min(60 * 60 * 1000, 60_000 * 2 ** Math.max(0, attemptCount - 1));
}

export async function processEmailOutboxBatch(limit = 20) {
  const now = new Date();
  const staleBefore = new Date(now.getTime() - STALE_LOCK_MS);
  const candidates = await prisma.emailOutbox.findMany({
    where: {
      attemptCount: { lt: MAX_EMAIL_ATTEMPTS },
      OR: [
        { status: { in: [EmailOutboxStatus.PENDING, EmailOutboxStatus.FAILED] }, availableAt: { lte: now } },
        { status: EmailOutboxStatus.PROCESSING, lockedAt: { lte: staleBefore } }
      ]
    },
    orderBy: [{ availableAt: "asc" }, { createdAt: "asc" }],
    take: Math.min(Math.max(limit, 1), 100)
  });

  let sent = 0;
  let failed = 0;
  for (const candidate of candidates) {
    const claimed = await prisma.emailOutbox.updateMany({
      where: {
        id: candidate.id,
        attemptCount: { lt: MAX_EMAIL_ATTEMPTS },
        OR: [
          { status: { in: [EmailOutboxStatus.PENDING, EmailOutboxStatus.FAILED] }, availableAt: { lte: now } },
          { status: EmailOutboxStatus.PROCESSING, lockedAt: { lte: staleBefore } }
        ]
      },
      data: { status: EmailOutboxStatus.PROCESSING, lockedAt: now, attemptCount: { increment: 1 } }
    });
    if (claimed.count === 0) {
      continue;
    }

    try {
      const payload = storedPayloadSchema.parse(candidate.payloadJson);
      const result = await sendEmail({
        to: candidate.recipient,
        subject: candidate.subject,
        html: payload.html,
        text: payload.text,
        replyTo: payload.replyTo
      });
      if (!result.sent) {
        throw new Error(result.skipped ? "SMTP is not configured." : "SMTP delivery failed.");
      }
      await prisma.emailOutbox.update({
        where: { id: candidate.id },
        data: { status: EmailOutboxStatus.SENT, sentAt: new Date(), lockedAt: null, lastError: null }
      });
      sent += 1;
    } catch (error) {
      const attemptCount = candidate.attemptCount + 1;
      await prisma.emailOutbox.update({
        where: { id: candidate.id },
        data: {
          status: EmailOutboxStatus.FAILED,
          lockedAt: null,
          availableAt: new Date(Date.now() + retryDelayMs(attemptCount)),
          lastError: error instanceof Error ? error.message.slice(0, 2000) : "Unknown email worker error."
        }
      });
      logServerError("email-outbox/process", error);
      failed += 1;
    }
  }

  return { examined: candidates.length, sent, failed };
}

export async function cleanupOperationalRecords() {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [rateLimits, sessions] = await Promise.all([
    prisma.rateLimitBucket.deleteMany({ where: { expiresAt: { lt: cutoff } } }),
    prisma.adminSession.deleteMany({ where: { OR: [{ expiresAt: { lt: cutoff } }, { revokedAt: { lt: cutoff } }] } })
  ]);
  return { rateLimits: rateLimits.count, sessions: sessions.count };
}
