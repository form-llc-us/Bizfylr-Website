import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { Prisma, PaymentOrderStatus, RazorpayWebhookEventStatus } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { logServerError } from "@/lib/server";
import {
  findPaymentOrderByProviderOrderId,
  markPaymentOrderFromWebhook
} from "@/lib/submissions";

export const supportedRazorpayWebhookEvents = [
  "payment.authorized",
  "payment.failed",
  "payment.captured",
  "payment.dispute.created",
  "payment.dispute.under_review",
  "payment.dispute.action_required",
  "payment.dispute.won",
  "payment.dispute.lost",
  "payment.dispute.closed",
  "order.paid",
  "invoice.paid",
  "invoice.partially_paid",
  "invoice.expired",
  "subscription.authenticated",
  "subscription.pending",
  "subscription.activated",
  "subscription.charged",
  "subscription.updated",
  "subscription.paused",
  "subscription.resumed",
  "subscription.halted",
  "subscription.cancelled",
  "subscription.completed",
  "refund.created",
  "refund.processed",
  "refund.failed",
  "refund.speed_changed",
  "payment_link.paid",
  "payment_link.partially_paid",
  "payment_link.expired",
  "payment_link.cancelled",
  "settlement.processed"
] as const;

type SupportedRazorpayWebhookEvent = (typeof supportedRazorpayWebhookEvents)[number];

type RazorpayEntity = Record<string, unknown>;

type RazorpayWebhookPayload = {
  id: string;
  event: string;
  created_at?: number;
  payload?: Record<string, unknown>;
};

type WebhookIdentifiers = {
  providerCustomerId?: string;
  providerDisputeId?: string;
  providerInvoiceId?: string;
  providerOrderId?: string;
  providerPaymentId?: string;
  providerPaymentLinkId?: string;
  providerRefundId?: string;
  providerSettlementId?: string;
  providerSubscriptionId?: string;
};

type HandlerResult = {
  message: string;
  outcome: "processed" | "ignored" | "unmatched";
};

export type RazorpayWebhookProcessResult = {
  body: {
    duplicate?: boolean;
    classification?: "processed" | "ignored" | "unmatched";
    eventId?: string;
    eventType?: string;
    message: string;
    processed?: boolean;
    received: boolean;
  };
  statusCode: number;
};

const webhookPayloadSchema = z
  .object({
    id: z.string().trim().min(1),
    event: z.string().trim().min(1),
    created_at: z.number().optional(),
    payload: z.record(z.string(), z.unknown()).optional()
  })
  .passthrough();

const staleProcessingMs = 15 * 60 * 1000;

export class RazorpayWebhookPayloadError extends Error {}

export function verifyRazorpayWebhookSignature(body: Buffer, signature: string, secret: string) {
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const receivedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer);
}

function isSupportedRazorpayWebhookEvent(event: string): event is SupportedRazorpayWebhookEvent {
  return supportedRazorpayWebhookEvents.includes(event as SupportedRazorpayWebhookEvent);
}

function getNestedEntity(payload: RazorpayWebhookPayload, key: string) {
  const wrapper = payload.payload?.[key];

  if (!wrapper || typeof wrapper !== "object" || !("entity" in wrapper)) {
    return null;
  }

  const entity = (wrapper as { entity?: unknown }).entity;
  return entity && typeof entity === "object" ? (entity as RazorpayEntity) : null;
}

function getString(entity: RazorpayEntity | null, key: string) {
  const value = entity?.[key];
  return typeof value === "string" && value.trim() ? value : undefined;
}

function getNumber(entity: RazorpayEntity | null, key: string) {
  const value = entity?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function extractIdentifiers(payload: RazorpayWebhookPayload): WebhookIdentifiers {
  const payment = getNestedEntity(payload, "payment");
  const order = getNestedEntity(payload, "order");
  const invoice = getNestedEntity(payload, "invoice");
  const refund = getNestedEntity(payload, "refund");
  const subscription = getNestedEntity(payload, "subscription");
  const paymentLink = getNestedEntity(payload, "payment_link");
  const settlement = getNestedEntity(payload, "settlement");
  const dispute = getNestedEntity(payload, "dispute");

  return {
    providerPaymentId:
      getString(payment, "id") ?? getString(refund, "payment_id") ?? getString(dispute, "payment_id"),
    providerOrderId:
      getString(payment, "order_id") ?? getString(order, "id") ?? getString(invoice, "order_id"),
    providerInvoiceId: getString(invoice, "id"),
    providerRefundId: getString(refund, "id"),
    providerSubscriptionId: getString(subscription, "id"),
    providerPaymentLinkId: getString(paymentLink, "id"),
    providerSettlementId: getString(settlement, "id"),
    providerDisputeId: getString(dispute, "id"),
    providerCustomerId:
      getString(payment, "customer_id") ??
      getString(invoice, "customer_id") ??
      getString(subscription, "customer_id") ??
      getString(paymentLink, "customer_id")
  };
}

function formatErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown webhook processing error.";
}

async function claimWebhookEvent(input: {
  identifiers: WebhookIdentifiers;
  payload: RazorpayWebhookPayload;
  payloadHash: string;
}) {
  const processingStartedAt = new Date();
  const data = {
    eventId: input.payload.id,
    provider: "razorpay",
    eventType: input.payload.event,
    status: RazorpayWebhookEventStatus.PROCESSING,
    ...input.identifiers,
    payloadHash: input.payloadHash,
    processingStartedAt
  };

  try {
    const event = await prisma.razorpayWebhookEvent.create({ data });
    return { event, shouldProcess: true, duplicate: false, startedAt: processingStartedAt };
  } catch (error) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") {
      throw error;
    }

    const existing = await prisma.razorpayWebhookEvent.findUnique({
      where: {
        eventId: input.payload.id
      }
    });

    if (!existing) {
      throw error;
    }

    if (existing.payloadHash && existing.payloadHash !== input.payloadHash) {
      console.warn("[razorpay/webhook] event payload hash conflict", {
        eventId: input.payload.id,
        eventType: input.payload.event
      });
      return { event: existing, shouldProcess: false, duplicate: true, startedAt: processingStartedAt };
    }

    const processingStarted = existing.processingStartedAt?.getTime() ?? existing.updatedAt.getTime();
    const isStaleProcessing =
      existing.status === RazorpayWebhookEventStatus.PROCESSING &&
      Date.now() - processingStarted > staleProcessingMs;
    if (existing.status !== RazorpayWebhookEventStatus.FAILED && !isStaleProcessing) {
      return { event: existing, shouldProcess: false, duplicate: true, startedAt: processingStartedAt };
    }

    const claimed = await prisma.razorpayWebhookEvent.updateMany({
      where: isStaleProcessing
        ? { eventId: input.payload.id, status: RazorpayWebhookEventStatus.PROCESSING, processingStartedAt: { lte: new Date(Date.now() - staleProcessingMs) } }
        : { eventId: input.payload.id, status: RazorpayWebhookEventStatus.FAILED },
      data: {
        status: RazorpayWebhookEventStatus.PROCESSING,
        errorMessage: null,
        processingStartedAt,
        processedAt: null,
        processingMs: null,
        attemptCount: { increment: 1 },
        ...input.identifiers,
        payloadHash: input.payloadHash
      }
    });

    if (claimed.count === 0) {
      return { event: existing, shouldProcess: false, duplicate: true, startedAt: processingStartedAt };
    }

    const event = await prisma.razorpayWebhookEvent.findUniqueOrThrow({ where: { eventId: input.payload.id } });

    return { event, shouldProcess: true, duplicate: true, startedAt: processingStartedAt };
  }
}

async function completeWebhookEvent(input: {
  eventId: string;
  status: RazorpayWebhookEventStatus;
  startedAt: Date;
  errorMessage?: string;
}) {
  const processedAt = new Date();
  const processingMs = Math.max(0, processedAt.getTime() - input.startedAt.getTime());

  await prisma.razorpayWebhookEvent.update({
    where: {
      eventId: input.eventId
    },
    data: {
      status: input.status,
      errorMessage: input.errorMessage,
      processedAt,
      processingMs
    }
  });
}

async function handlePaymentCaptured(payload: RazorpayWebhookPayload): Promise<HandlerResult> {
  const payment = getNestedEntity(payload, "payment");
  const paymentId = getString(payment, "id");
  const orderId = getString(payment, "order_id");

  if (!paymentId || !orderId) {
    return { outcome: "ignored", message: "Payment capture event did not include payment and order identifiers." };
  }

  const storedOrder = await findPaymentOrderByProviderOrderId(orderId);

  if (!storedOrder) {
    return { outcome: "unmatched", message: "Payment capture has no matching local order; reconciliation is required." };
  }

  const expectedAmountMinor = storedOrder.totalAmountMinor ?? storedOrder.amountMinor;
  const amountMatches = getNumber(payment, "amount") === expectedAmountMinor;
  const currencyMatches = getString(payment, "currency") === storedOrder.currency;
  const orderMatches = orderId === storedOrder.providerOrderId;
  const statusMatches = getString(payment, "status") === "captured";

  if (!amountMatches || !currencyMatches || !orderMatches || !statusMatches) {
    return { outcome: "unmatched", message: "Payment capture did not match the local amount, currency, order, or captured state." };
  }

  const result = await markPaymentOrderFromWebhook({
    providerOrderId: orderId,
    providerPaymentId: paymentId,
    status: PaymentOrderStatus.PAID
  });

  return result?.order
    ? { outcome: "processed", message: "Payment capture processed." }
    : { outcome: "unmatched", message: "Payment capture could not be matched during the state update." };
}

async function handlePaymentFailed(payload: RazorpayWebhookPayload): Promise<HandlerResult> {
  const payment = getNestedEntity(payload, "payment");
  const paymentId = getString(payment, "id");
  const orderId = getString(payment, "order_id");

  if (!paymentId && !orderId) {
    return { outcome: "ignored", message: "Payment failure event did not include payment or order identifiers." };
  }

  const result = await markPaymentOrderFromWebhook({
    providerOrderId: orderId,
    providerPaymentId: paymentId,
    status: PaymentOrderStatus.FAILED,
    failureCode: getString(payment, "error_code"),
    failureReason: getString(payment, "error_description") ?? "Razorpay webhook reported the payment as failed."
  });

  return {
    outcome: result?.order ? "processed" : "unmatched",
    message: result?.order ? "Payment failure processed." : "Payment failure acknowledged without a matching order."
  };
}

async function handlePaymentAuthorized(): Promise<HandlerResult> {
  return {
    outcome: "ignored",
    message: "Payment authorization logged. Manual capture is not enabled in the current Bizfylr workflow."
  };
}

async function handleOrderPaid(payload: RazorpayWebhookPayload): Promise<HandlerResult> {
  const order = getNestedEntity(payload, "order");
  const orderId = getString(order, "id");

  if (!orderId) {
    return { outcome: "ignored", message: "Order paid event did not include an order identifier." };
  }

  return {
    outcome: "ignored",
    message: "Order paid event recorded as informational; payment.captured is authoritative for payment success."
  };
}

async function handleLoggedBusinessEvent(payload: RazorpayWebhookPayload): Promise<HandlerResult> {
  return {
    outcome: "ignored",
    message: `${payload.event} logged. No dedicated Bizfylr business model exists for this event yet.`
  };
}

async function dispatchRazorpayWebhook(payload: RazorpayWebhookPayload): Promise<HandlerResult> {
  switch (payload.event) {
    case "payment.captured":
      return handlePaymentCaptured(payload);
    case "payment.failed":
      return handlePaymentFailed(payload);
    case "payment.authorized":
      return handlePaymentAuthorized();
    case "order.paid":
      return handleOrderPaid(payload);
    default:
      return handleLoggedBusinessEvent(payload);
  }
}

function logWebhookResult(input: {
  eventId: string;
  eventType: string;
  identifiers: WebhookIdentifiers;
  message: string;
  processed: boolean;
  classification: HandlerResult["outcome"];
  processingMs: number;
}) {
  console.info("[razorpay/webhook]", {
    eventId: input.eventId,
    eventType: input.eventType,
    paymentId: input.identifiers.providerPaymentId,
    orderId: input.identifiers.providerOrderId,
    processingMs: input.processingMs,
    processed: input.processed,
    classification: input.classification,
    message: input.message
  });
}

export async function processRazorpayWebhookPayload(rawPayload: string): Promise<RazorpayWebhookProcessResult> {
  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(rawPayload);
  } catch {
    throw new RazorpayWebhookPayloadError("Webhook payload is not valid JSON.");
  }

  const parsed = webhookPayloadSchema.safeParse(parsedJson);

  if (!parsed.success) {
    throw new RazorpayWebhookPayloadError("Webhook payload is missing required Razorpay fields.");
  }

  const payload = parsed.data;
  const identifiers = extractIdentifiers(payload);
  const payloadHash = createHash("sha256").update(rawPayload).digest("hex");

  try {
    const claimed = await claimWebhookEvent({ identifiers, payload, payloadHash });

    if (!claimed.shouldProcess) {
      return {
        statusCode: 200,
        body: {
          received: true,
          duplicate: true,
          processed: false,
          eventId: payload.id,
          eventType: payload.event,
          message: `Webhook event already ${claimed.event.status.toLowerCase()}.`
        }
      };
    }

    if (!isSupportedRazorpayWebhookEvent(payload.event)) {
      await completeWebhookEvent({
        eventId: payload.id,
        status: RazorpayWebhookEventStatus.IGNORED,
        startedAt: claimed.startedAt
      });

      return {
        statusCode: 200,
        body: {
          received: true,
          processed: false,
          eventId: payload.id,
          eventType: payload.event,
          message: "Webhook event type is not used by this application."
        }
      };
    }

    try {
      const result = await dispatchRazorpayWebhook(payload);
      const eventStatus = result.outcome === "processed"
        ? RazorpayWebhookEventStatus.PROCESSED
        : result.outcome === "unmatched"
          ? RazorpayWebhookEventStatus.UNMATCHED
          : RazorpayWebhookEventStatus.IGNORED;
      await completeWebhookEvent({
        eventId: payload.id,
        status: eventStatus,
        startedAt: claimed.startedAt,
        errorMessage: result.outcome === "processed" ? undefined : result.message
      });

      logWebhookResult({
        eventId: payload.id,
        eventType: payload.event,
        identifiers,
        message: result.message,
        processed: result.outcome === "processed",
        classification: result.outcome,
        processingMs: Math.max(0, Date.now() - claimed.startedAt.getTime())
      });

      return {
        statusCode: 200,
        body: {
          received: true,
          processed: result.outcome === "processed",
          classification: result.outcome,
          eventId: payload.id,
          eventType: payload.event,
          message: result.message
        }
      };
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      await completeWebhookEvent({
        eventId: payload.id,
        status: RazorpayWebhookEventStatus.FAILED,
        startedAt: claimed.startedAt,
        errorMessage
      });
      logServerError("razorpay/webhook/process", error);

      return {
        statusCode: 500,
        body: {
          received: true,
          processed: false,
          eventId: payload.id,
          eventType: payload.event,
          message: "Webhook processing failed and will be retried."
        }
      };
    }
  } catch (error) {
    logServerError("razorpay/webhook/persist", error);

    return {
      statusCode: 503,
      body: {
        received: true,
        processed: false,
        eventId: payload.id,
        eventType: payload.event,
        message: "Webhook event could not be durably recorded."
      }
    };
  }
}
