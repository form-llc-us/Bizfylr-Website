import { Prisma, RazorpayWebhookEventStatus } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createEvent: vi.fn(),
  findEvent: vi.fn(),
  findEventOrThrow: vi.fn(),
  updateEvent: vi.fn(),
  updateManyEvents: vi.fn(),
  findOrder: vi.fn(),
  markOrder: vi.fn(),
  logError: vi.fn()
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    razorpayWebhookEvent: {
      create: mocks.createEvent,
      findUnique: mocks.findEvent,
      findUniqueOrThrow: mocks.findEventOrThrow,
      update: mocks.updateEvent,
      updateMany: mocks.updateManyEvents
    }
  }
}));

vi.mock("@/lib/submissions", () => ({
  findPaymentOrderByProviderOrderId: mocks.findOrder,
  markPaymentOrderFromWebhook: mocks.markOrder
}));

vi.mock("@/lib/server", () => ({ logServerError: mocks.logError }));

import { processRazorpayWebhookPayload } from "@/lib/razorpay/webhook";

function eventRecord(status: RazorpayWebhookEventStatus = RazorpayWebhookEventStatus.PROCESSING) {
  const now = new Date();
  return {
    id: "local-event",
    eventId: "evt_1",
    eventType: "invoice.paid",
    status,
    processingStartedAt: now,
    updatedAt: now,
    payloadHash: null
  };
}

function duplicateError() {
  return new Prisma.PrismaClientKnownRequestError("duplicate", {
    code: "P2002",
    clientVersion: "6.19.3"
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.updateEvent.mockResolvedValue(eventRecord(RazorpayWebhookEventStatus.PROCESSED));
  mocks.updateManyEvents.mockResolvedValue({ count: 0 });
});

describe("durable Razorpay webhook processing", () => {
  it("returns 503 when the event cannot be durably recorded", async () => {
    mocks.createEvent.mockRejectedValue(new Error("database unavailable"));
    const result = await processRazorpayWebhookPayload(JSON.stringify({ id: "evt_1", event: "invoice.paid" }));
    expect(result.statusCode).toBe(503);
    expect(result.body.received).toBe(true);
  });

  it("records and acknowledges unsupported signed event types", async () => {
    mocks.createEvent.mockResolvedValue(eventRecord());
    const result = await processRazorpayWebhookPayload(JSON.stringify({ id: "evt_1", event: "new.event" }));
    expect(result.statusCode).toBe(200);
    expect(result.body.processed).toBe(false);
    expect(mocks.updateEvent).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ status: RazorpayWebhookEventStatus.IGNORED })
    }));
  });

  it("returns 500 after a durable record when payment processing fails", async () => {
    mocks.createEvent.mockResolvedValue(eventRecord());
    mocks.findOrder.mockResolvedValue({
      id: "local-order",
      providerOrderId: "order_1",
      amountMinor: 1000,
      totalAmountMinor: 1000,
      currency: "USD"
    });
    mocks.markOrder.mockRejectedValue(new Error("transaction failed"));
    const payload = {
      id: "evt_1",
      event: "payment.captured",
      payload: {
        payment: { entity: { id: "pay_1", order_id: "order_1", amount: 1000, currency: "USD", status: "captured" } }
      }
    };
    const result = await processRazorpayWebhookPayload(JSON.stringify(payload));
    expect(result.statusCode).toBe(500);
    expect(mocks.updateEvent).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ status: RazorpayWebhookEventStatus.FAILED })
    }));
  });

  it("marks a matching captured payment paid", async () => {
    mocks.createEvent.mockResolvedValue(eventRecord());
    mocks.findOrder.mockResolvedValue({
      id: "local-order",
      providerOrderId: "order_1",
      amountMinor: 1000,
      totalAmountMinor: 1000,
      currency: "USD"
    });
    mocks.markOrder.mockResolvedValue({ order: { id: "local-order" } });
    const result = await processRazorpayWebhookPayload(JSON.stringify({
      id: "evt_capture",
      event: "payment.captured",
      payload: { payment: { entity: {
        id: "pay_1", order_id: "order_1", amount: 1000, currency: "USD", status: "captured"
      } } }
    }));
    expect(result).toMatchObject({ statusCode: 200, body: { processed: true, classification: "processed" } });
    expect(mocks.markOrder).toHaveBeenCalledWith(expect.objectContaining({ status: "PAID" }));
  });

  it("acknowledges an unmatched capture for reconciliation without triggering retries", async () => {
    mocks.createEvent.mockResolvedValue(eventRecord());
    mocks.findOrder.mockResolvedValue(null);
    const result = await processRazorpayWebhookPayload(JSON.stringify({
      id: "evt_unmatched",
      event: "payment.captured",
      payload: { payment: { entity: {
        id: "pay_2", order_id: "order_missing", amount: 1000, currency: "USD", status: "captured"
      } } }
    }));
    expect(result).toMatchObject({ statusCode: 200, body: { processed: false, classification: "unmatched" } });
    expect(mocks.markOrder).not.toHaveBeenCalled();
    expect(mocks.updateEvent).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ status: RazorpayWebhookEventStatus.UNMATCHED })
    }));
  });

  it("records order.paid as informational and never marks an order paid", async () => {
    mocks.createEvent.mockResolvedValue(eventRecord());
    const result = await processRazorpayWebhookPayload(JSON.stringify({
      id: "evt_order_paid",
      event: "order.paid",
      payload: { order: { entity: { id: "order_1", status: "paid" } } }
    }));
    expect(result).toMatchObject({ statusCode: 200, body: { processed: false, classification: "ignored" } });
    expect(mocks.findOrder).not.toHaveBeenCalled();
    expect(mocks.markOrder).not.toHaveBeenCalled();
  });

  it("acknowledges a previously processed duplicate without rerunning business logic", async () => {
    mocks.createEvent.mockRejectedValue(duplicateError());
    mocks.findEvent.mockResolvedValue(eventRecord(RazorpayWebhookEventStatus.PROCESSED));
    const result = await processRazorpayWebhookPayload(JSON.stringify({ id: "evt_1", event: "invoice.paid" }));
    expect(result.statusCode).toBe(200);
    expect(result.body.duplicate).toBe(true);
    expect(mocks.markOrder).not.toHaveBeenCalled();
  });

  it("keeps concurrent duplicate delivery single-claim safe", async () => {
    let inserted = false;
    mocks.createEvent.mockImplementation(async () => {
      if (inserted) throw duplicateError();
      inserted = true;
      return eventRecord();
    });
    mocks.findEvent.mockResolvedValue(eventRecord(RazorpayWebhookEventStatus.PROCESSING));
    const body = JSON.stringify({ id: "evt_1", event: "invoice.paid" });
    const results = await Promise.all([
      processRazorpayWebhookPayload(body),
      processRazorpayWebhookPayload(body)
    ]);
    expect(results.every((result) => result.statusCode === 200)).toBe(true);
    expect(results.filter((result) => result.body.duplicate).length).toBe(1);
    expect(mocks.createEvent).toHaveBeenCalledTimes(2);
  });
});
