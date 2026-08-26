import {
  PaymentAttemptStatus,
  PaymentOrderStatus,
  Prisma,
  ProviderOrderCreationStatus,
  SubmissionKind
} from "@prisma/client";

import {
  contactOutboxMessages,
  enqueueEmailMessages,
  newsletterOutboxMessages,
  paymentFailureOutboxMessages,
  paymentOrderCreatedOutboxMessages,
  paymentSuccessOutboxMessages
} from "@/lib/email-outbox";
import { type PaymentBreakdown } from "@/lib/payment";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import type {
  ContactFormValues,
  LeadFormValues,
  NewsletterFormValues,
  PaymentFormValues
} from "@/lib/validations";

const paymentStatusRank: Record<PaymentOrderStatus, number> = {
  CREATED: 0,
  FAILED: 1,
  PAID: 2,
  VERIFIED: 3
};

const attemptStatusRank: Record<PaymentAttemptStatus, number> = {
  AUTHORIZED: 0,
  FAILED: 1,
  CAPTURED: 2
};

export class PaymentIdempotencyConflictError extends Error {}

function requireDatabase() {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not configured.");
  }
}

export function nextPaymentStatus(current: PaymentOrderStatus, incoming: PaymentOrderStatus) {
  return paymentStatusRank[incoming] >= paymentStatusRank[current] ? incoming : current;
}

export function nextPaymentAttemptStatus(current: PaymentAttemptStatus, incoming: PaymentAttemptStatus) {
  return attemptStatusRank[incoming] >= attemptStatusRank[current] ? incoming : current;
}

function contactEmailInput(record: {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  service: string;
  message: string;
  source: string;
  createdAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
}) {
  return {
    submissionId: record.id,
    name: record.name,
    email: record.email,
    phone: record.phone,
    company: record.company,
    service: record.service,
    message: record.message,
    source: record.source,
    submittedAt: record.createdAt.toISOString(),
    ipAddress: record.ipAddress ?? undefined,
    userAgent: record.userAgent ?? undefined
  };
}

export async function createLeadSubmission(input: {
  values: LeadFormValues;
  source: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  requireDatabase();
  return prisma.$transaction(async (tx) => {
    const record = await tx.contactSubmission.create({
      data: {
        kind: SubmissionKind.LEAD,
        source: input.source,
        name: input.values.name,
        email: input.values.email,
        phone: input.values.phone,
        service: input.values.service,
        message: input.values.message,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent
      }
    });
    await enqueueEmailMessages(tx, contactOutboxMessages(contactEmailInput(record)));
    return record;
  });
}

export async function createContactSubmission(input: {
  values: ContactFormValues;
  source: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  requireDatabase();
  return prisma.$transaction(async (tx) => {
    const record = await tx.contactSubmission.create({
      data: {
        kind: SubmissionKind.CONTACT,
        source: input.source,
        name: input.values.name,
        email: input.values.email,
        phone: input.values.phone,
        service: input.values.service,
        message: input.values.message,
        company: input.values.company || null,
        budget: input.values.budget || null,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent
      }
    });
    await enqueueEmailMessages(tx, contactOutboxMessages(contactEmailInput(record)));
    return record;
  });
}

export async function createNewsletterSubscriber(input: {
  values: NewsletterFormValues;
  source?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  requireDatabase();
  const email = input.values.email.trim().toLowerCase();
  try {
    const subscriber = await prisma.$transaction(async (tx) => {
      const created = await tx.newsletterSubscriber.create({
        data: {
          email,
          source: input.source ?? "website",
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
          consentAt: new Date()
        }
      });
      await enqueueEmailMessages(tx, newsletterOutboxMessages({
        subscriberId: created.id,
        email: created.email,
        source: created.source,
        submittedAt: created.createdAt.toISOString()
      }));
      return created;
    });
    return { subscriber, isNew: true };
  } catch (error) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") {
      throw error;
    }
    const subscriber = await prisma.newsletterSubscriber.findUniqueOrThrow({ where: { email } });
    return { subscriber, isNew: false };
  }
}

function paymentOrderData(input: {
  values: PaymentFormValues;
  breakdown: PaymentBreakdown;
  taxNote: string;
  receipt: string;
}) {
  return {
    service: input.values.service,
    amountMinor: input.breakdown.totalAmountMinor,
    subtotalMinor: input.breakdown.subtotalMinor,
    discountMinor: input.breakdown.discountMinor,
    gstRate: input.breakdown.gstRate,
    gstAmountMinor: input.breakdown.gstAmountMinor,
    taxableAmountMinor: input.breakdown.taxableMinor,
    totalAmountMinor: input.breakdown.totalAmountMinor,
    currency: input.values.currency,
    country: input.values.billingCountry,
    billingName: input.values.name,
    billingEmail: input.values.email,
    billingPhone: input.values.phone,
    billingAddress: input.values.billingAddress,
    billingCountry: input.values.billingCountry,
    billingState: input.values.billingState || null,
    billingGstin: input.values.billingGstin || null,
    billingCompany: input.values.companyName || null,
    couponCode: input.breakdown.couponCode || null,
    couponDiscountType: input.breakdown.couponDiscountType || null,
    couponDiscountValue: input.breakdown.couponDiscountValue ?? null,
    receipt: input.receipt,
    taxNote: input.taxNote,
    taxLabel: input.breakdown.taxLabel,
    status: PaymentOrderStatus.CREATED,
    notes: {
      service: input.values.service,
      billingCountry: input.values.billingCountry,
      billingState: input.values.billingState || null,
      billingGstin: input.values.billingGstin || null,
      billingCompany: input.values.companyName || null,
      couponCode: input.breakdown.couponCode || null,
      breakdown: input.breakdown
    }
  } satisfies Prisma.PaymentOrderUncheckedCreateInput;
}

export async function createOrClaimPaymentIntent(input: {
  values: PaymentFormValues;
  breakdown: PaymentBreakdown;
  taxNote: string;
  receipt: string;
  idempotencyKey: string;
  requestHash: string;
}) {
  requireDatabase();
  try {
    const order = await prisma.paymentOrder.create({
      data: {
        ...paymentOrderData(input),
        idempotencyKey: input.idempotencyKey,
        requestHash: input.requestHash,
        providerCreateStatus: ProviderOrderCreationStatus.CREATING,
        providerCreateAttempts: 1
      }
    });
    return { order, shouldCreateProviderOrder: true, duplicate: false };
  } catch (error) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") {
      throw error;
    }
  }

  const existing = await prisma.paymentOrder.findUniqueOrThrow({ where: { idempotencyKey: input.idempotencyKey } });
  if (existing.requestHash !== input.requestHash) {
    throw new PaymentIdempotencyConflictError("The idempotency key was already used with different payment details.");
  }
  if (existing.providerOrderId) {
    return { order: existing, shouldCreateProviderOrder: false, duplicate: true };
  }

  const claimed = await prisma.paymentOrder.updateMany({
    where: {
      id: existing.id,
      providerOrderId: null,
      OR: [
        { providerCreateStatus: { in: [ProviderOrderCreationStatus.PENDING, ProviderOrderCreationStatus.FAILED] } },
        {
          providerCreateStatus: ProviderOrderCreationStatus.CREATING,
          updatedAt: { lte: new Date(Date.now() - 5 * 60_000) }
        }
      ]
    },
    data: {
      providerCreateStatus: ProviderOrderCreationStatus.CREATING,
      providerCreateAttempts: { increment: 1 },
      providerCreateError: null
    }
  });
  const order = claimed.count > 0 ? await prisma.paymentOrder.findUniqueOrThrow({ where: { id: existing.id } }) : existing;
  return { order, shouldCreateProviderOrder: claimed.count > 0, duplicate: true };
}

export async function completePaymentIntentProviderOrder(input: {
  orderId: string;
  providerOrderId: string;
  receipt: string;
}) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.paymentOrder.update({
      where: { id: input.orderId },
      data: {
        providerOrderId: input.providerOrderId,
        receipt: input.receipt,
        providerCreateStatus: ProviderOrderCreationStatus.CREATED,
        providerCreateError: null
      }
    });
    await enqueueEmailMessages(tx, paymentOrderCreatedOutboxMessages(order));
    return order;
  });
}

export async function markPaymentIntentProviderFailure(orderId: string, error: unknown) {
  await prisma.paymentOrder.updateMany({
    where: { id: orderId, providerOrderId: null },
    data: {
      providerCreateStatus: ProviderOrderCreationStatus.FAILED,
      providerCreateError: error instanceof Error ? error.message.slice(0, 2000) : "Provider order creation failed."
    }
  });
}

export async function findPaymentOrderByProviderOrderId(providerOrderId: string) {
  requireDatabase();
  return prisma.paymentOrder.findUnique({ where: { providerOrderId } });
}

export async function findPaymentOrderById(id: string) {
  requireDatabase();
  return prisma.paymentOrder.findUnique({ where: { id } });
}

async function upsertAttempt(
  tx: Prisma.TransactionClient,
  order: { id: string; providerOrderId: string | null; amountMinor: number; totalAmountMinor: number | null; currency: string },
  input: {
    providerPaymentId?: string;
    providerSignature?: string;
    status: PaymentAttemptStatus;
    failureCode?: string;
    failureReason?: string;
  }
) {
  if (!input.providerPaymentId || !order.providerOrderId) {
    return null;
  }
  const existing = await tx.paymentAttempt.findUnique({ where: { providerPaymentId: input.providerPaymentId } });
  const status = existing ? nextPaymentAttemptStatus(existing.status, input.status) : input.status;
  return tx.paymentAttempt.upsert({
    where: { providerPaymentId: input.providerPaymentId },
    create: {
      paymentOrderId: order.id,
      providerOrderId: order.providerOrderId,
      providerPaymentId: input.providerPaymentId,
      providerSignature: input.providerSignature,
      amountMinor: order.totalAmountMinor ?? order.amountMinor,
      currency: order.currency,
      status,
      failureCode: input.failureCode,
      failureReason: input.failureReason,
      paidAt: status === PaymentAttemptStatus.CAPTURED ? new Date() : null
    },
    update: {
      status,
      providerSignature: existing?.providerSignature ?? input.providerSignature,
      failureCode: input.failureCode ?? existing?.failureCode,
      failureReason: input.failureReason ?? existing?.failureReason,
      paidAt: status === PaymentAttemptStatus.CAPTURED ? existing?.paidAt ?? new Date() : existing?.paidAt
    }
  });
}

export async function markPaymentOrderVerified(input: {
  providerOrderId: string;
  providerPaymentId: string;
  providerSignature: string;
}) {
  requireDatabase();
  return prisma.$transaction(async (tx) => {
    const existing = await tx.paymentOrder.findUnique({ where: { providerOrderId: input.providerOrderId } });
    if (!existing) return null;
    await upsertAttempt(tx, existing, {
      providerPaymentId: input.providerPaymentId,
      providerSignature: input.providerSignature,
      status: PaymentAttemptStatus.CAPTURED
    });
    const updated = await tx.paymentOrder.update({
      where: { id: existing.id },
      data: {
        providerPaymentId: existing.providerPaymentId ?? input.providerPaymentId,
        providerSignature: existing.providerSignature ?? input.providerSignature,
        status: PaymentOrderStatus.VERIFIED,
        paidAt: existing.paidAt ?? new Date(),
        verifiedAt: existing.verifiedAt ?? new Date()
      }
    });
    await enqueueEmailMessages(tx, paymentSuccessOutboxMessages(updated));
    return { order: updated, shouldSendSuccessEmail: false };
  });
}

export async function markPaymentOrderFromWebhook(input: {
  providerOrderId?: string;
  providerPaymentId?: string;
  status: PaymentOrderStatus;
  failureCode?: string;
  failureReason?: string;
}) {
  requireDatabase();
  if (!input.providerOrderId && !input.providerPaymentId) return null;

  return prisma.$transaction(async (tx) => {
    const existing = input.providerOrderId
      ? await tx.paymentOrder.findUnique({ where: { providerOrderId: input.providerOrderId } })
      : await tx.paymentAttempt.findUnique({
          where: { providerPaymentId: input.providerPaymentId },
          include: { paymentOrder: true }
        }).then((attempt) => attempt?.paymentOrder ?? null);
    if (!existing) return null;

    const incomingAttemptStatus = input.status === PaymentOrderStatus.FAILED
      ? PaymentAttemptStatus.FAILED
      : PaymentAttemptStatus.CAPTURED;
    await upsertAttempt(tx, existing, {
      providerPaymentId: input.providerPaymentId,
      status: incomingAttemptStatus,
      failureCode: input.failureCode,
      failureReason: input.failureReason
    });

    const nextStatus = nextPaymentStatus(existing.status, input.status);
    const isSuccessful = paymentStatusRank[nextStatus] >= paymentStatusRank[PaymentOrderStatus.PAID];
    const updated = await tx.paymentOrder.update({
      where: { id: existing.id },
      data: {
        providerPaymentId: isSuccessful ? existing.providerPaymentId ?? input.providerPaymentId : existing.providerPaymentId,
        status: nextStatus,
        paidAt: isSuccessful ? existing.paidAt ?? new Date() : existing.paidAt,
        verifiedAt: nextStatus === PaymentOrderStatus.VERIFIED ? existing.verifiedAt ?? new Date() : existing.verifiedAt
      }
    });

    if (input.status === PaymentOrderStatus.FAILED && !isSuccessful) {
      await enqueueEmailMessages(tx, paymentFailureOutboxMessages({
        order: updated,
        razorpayOrderId: input.providerOrderId,
        razorpayPaymentId: input.providerPaymentId,
        reason: input.failureReason ?? "Razorpay reported the payment as failed."
      }));
    } else if (isSuccessful) {
      await enqueueEmailMessages(tx, paymentSuccessOutboxMessages(updated));
    }

    return { order: updated, shouldSendSuccessEmail: false, shouldSendFailureEmail: false };
  });
}

// Legacy timestamp helpers remain exported for API compatibility; delivery truth now lives in EmailOutbox.
export async function markOrderEmailSent(orderId: string) {
  return (await prisma.paymentOrder.updateMany({ where: { id: orderId, orderEmailSentAt: null }, data: { orderEmailSentAt: new Date() } })).count > 0;
}
export async function markPaymentSuccessEmailSent(orderId: string) {
  return (await prisma.paymentOrder.updateMany({ where: { id: orderId, paymentSuccessEmailSentAt: null }, data: { paymentSuccessEmailSentAt: new Date() } })).count > 0;
}
export async function markPaymentFailedEmailSent(orderId: string) {
  return (await prisma.paymentOrder.updateMany({ where: { id: orderId, paymentFailedEmailSentAt: null }, data: { paymentFailedEmailSentAt: new Date() } })).count > 0;
}
