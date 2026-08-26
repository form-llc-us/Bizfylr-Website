import { validateCoupon } from "@/lib/coupons";
import { paymentCurrencies, paymentSchema, type PaymentFormValues } from "@/lib/validations";

export const PAYMENT_MODEL = "CUSTOM_INVOICE" as const;

export const PAYMENT_LIMITS = {
  INR: {
    min: 100,
    max: 500000
  },
  USD: {
    min: 5,
    max: 10000
  }
} as const;

type PaymentCurrency = (typeof paymentCurrencies)[number];

export type PaymentBreakdown = {
  subtotalMinor: number;
  discountMinor: number;
  taxableMinor: number;
  gstRate: number;
  gstAmountMinor: number;
  totalAmountMinor: number;
  couponCode?: string;
  couponDiscountType?: "percentage" | "fixed";
  couponDiscountValue?: number;
  taxLabel: string;
};

export class PaymentValidationError extends Error {}

function assertValidPaymentAmount(amount: number, currency: PaymentCurrency) {
  if (!Number.isFinite(amount) || Number.isNaN(amount)) {
    throw new PaymentValidationError("Please enter a valid payment amount.");
  }

  if (!/^\d+(\.\d{1,2})?$/.test(amount.toString())) {
    throw new PaymentValidationError("Amounts can include at most two decimal places.");
  }

  const limits = PAYMENT_LIMITS[currency];

  if (amount < limits.min) {
    throw new PaymentValidationError(
      currency === "INR"
        ? `Minimum payment amount is INR ${limits.min}.`
        : `Minimum payment amount is USD ${limits.min}.`
    );
  }

  if (amount > limits.max) {
    throw new PaymentValidationError(
      currency === "INR"
        ? `Maximum payment amount is INR ${limits.max}.`
        : `Maximum payment amount is USD ${limits.max}.`
    );
  }
}

function normalizeBillingCountry(country?: string) {
  return country?.trim().toLowerCase() ?? "";
}

export function isIndianBillingCountry(country?: string) {
  const normalized = normalizeBillingCountry(country);
  return normalized === "india" || normalized === "in";
}

export function isPaymentConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID &&
      process.env.RAZORPAY_KEY_SECRET &&
      process.env.RAZORPAY_WEBHOOK_SECRET
  );
}

export function getPublicRazorpayKey() {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";
}

export function getRazorpayCredentials() {
  return {
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
    keySecret: process.env.RAZORPAY_KEY_SECRET ?? ""
  };
}

export function hasRazorpayApiCredentials() {
  const { keyId, keySecret } = getRazorpayCredentials();
  return Boolean(keyId && keySecret);
}

export function validatePaymentPayload(payload: unknown): PaymentFormValues {
  const data = paymentSchema.parse(payload);
  assertValidPaymentAmount(data.amount, data.currency);
  return data;
}

export function toMinorUnits(amount: number, currency: PaymentCurrency) {
  assertValidPaymentAmount(amount, currency);
  return Math.round(amount * 100);
}

export function formatMinorCurrency(amountMinor: number, currency: PaymentCurrency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(amountMinor / 100);
}

export function getTaxLabel(currency: PaymentCurrency, billingCountry?: string) {
  if (currency === "INR" && isIndianBillingCountry(billingCountry)) {
    return "GST (18%)";
  }

  return "No GST applied";
}

export function getTaxNote(currency: PaymentCurrency, billingCountry?: string) {
  if (currency === "INR" && isIndianBillingCountry(billingCountry)) {
    return "GST is calculated at 18% for India billing profiles and confirmed server-side before Razorpay checkout.";
  }

  return "Taxes are reviewed server-side. Non-India or non-INR billing currently does not apply GST in this checkout flow.";
}

export function calculatePaymentBreakdown(input: {
  amount: number;
  currency: PaymentCurrency;
  couponCode?: string | null;
  billingCountry?: string | null;
  billingState?: string | null;
  billingGstin?: string | null;
  service?: PaymentFormValues["service"];
}): PaymentBreakdown {
  const subtotalMinor = toMinorUnits(input.amount, input.currency);
  const couponResult = validateCoupon({
    code: input.couponCode,
    currency: input.currency,
    subtotalMinor,
    service: input.service
  });

  const discountMinor = couponResult.valid ? couponResult.discountMinor : 0;
  const taxableMinor = Math.max(0, subtotalMinor - discountMinor);
  const gstRate =
    input.currency === "INR" && isIndianBillingCountry(input.billingCountry ?? undefined) ? 18 : 0;
  const gstAmountMinor = gstRate > 0 ? Math.round(taxableMinor * (gstRate / 100)) : 0;
  const totalAmountMinor = Math.max(0, taxableMinor + gstAmountMinor);

  return {
    subtotalMinor,
    discountMinor,
    taxableMinor,
    gstRate,
    gstAmountMinor,
    totalAmountMinor,
    couponCode: couponResult.valid ? couponResult.code : undefined,
    couponDiscountType: couponResult.valid ? couponResult.discountType : undefined,
    couponDiscountValue: couponResult.valid ? couponResult.discountValue : undefined,
    taxLabel: getTaxLabel(input.currency, input.billingCountry ?? undefined)
  };
}

async function fetchRazorpayJson<T>(pathname: string) {
  const { keyId, keySecret } = getRazorpayCredentials();

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured.");
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const response = await fetch(`https://api.razorpay.com/v1${pathname}`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });

  const payload = (await response.json()) as T & {
    error?: {
      description?: string;
    };
  };

  if (!response.ok) {
    throw new Error(payload.error?.description ?? "Unable to fetch Razorpay payment details.");
  }

  return payload;
}

export async function createRazorpayOrder(input: {
  amountMinor: number;
  currency: PaymentCurrency;
  receipt: string;
  notes: Record<string, string>;
}) {
  const { keyId, keySecret } = getRazorpayCredentials();

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured.");
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: input.amountMinor,
      currency: input.currency,
      receipt: input.receipt,
      notes: input.notes
    })
  });

  const payload = (await response.json()) as {
    id?: string;
    amount?: number;
    currency?: string;
    receipt?: string;
    status?: string;
    error?: {
      description?: string;
    };
  };

  if (!response.ok || !payload.id) {
    throw new Error(payload.error?.description ?? "Unable to create Razorpay order.");
  }

  return {
    id: payload.id,
    amount: payload.amount ?? input.amountMinor,
    currency: (payload.currency as PaymentCurrency | undefined) ?? input.currency,
    receipt: payload.receipt ?? input.receipt,
    status: payload.status
  };
}

export async function findRecentRazorpayOrderByReceipt(input: {
  receipt: string;
  amountMinor: number;
  currency: PaymentCurrency;
  createdAfter: Date;
}) {
  const from = Math.max(0, Math.floor(input.createdAfter.getTime() / 1000) - 300);
  const payload = await fetchRazorpayJson<{
    items?: Array<{
      id: string;
      amount: number;
      currency: PaymentCurrency;
      receipt: string;
      status?: string;
    }>;
  }>(`/orders?from=${from}&count=100`);
  return payload.items?.find((order) =>
    order.receipt === input.receipt &&
    order.amount === input.amountMinor &&
    order.currency === input.currency
  ) ?? null;
}

export async function fetchRazorpayOrderDetails(orderId: string) {
  return fetchRazorpayJson<{
    id: string;
    amount: number;
    currency: PaymentCurrency;
    receipt: string;
    status?: string;
  }>(`/orders/${orderId}`);
}

export async function fetchRazorpayPaymentDetails(paymentId: string) {
  return fetchRazorpayJson<{
    id: string;
    amount: number;
    currency: PaymentCurrency;
    order_id: string;
    status: string;
  }>(`/payments/${paymentId}`);
}
