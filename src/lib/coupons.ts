import { paymentCurrencies, serviceOptions } from "@/lib/validations";

type CouponDiscountType = "percentage" | "fixed";
type PaymentCurrency = (typeof paymentCurrencies)[number];

type CouponConfig = {
  code: string;
  active: boolean;
  discountType: CouponDiscountType;
  discountValue: number;
  fixedAmountMinorByCurrency?: Partial<Record<PaymentCurrency, number>>;
  allowedCurrencies: readonly PaymentCurrency[];
  applicableServices: readonly (typeof serviceOptions)[number][];
  minSubtotalMinorByCurrency: Partial<Record<PaymentCurrency, number>>;
  maxDiscountMinorByCurrency?: Partial<Record<PaymentCurrency, number>>;
  startsAt?: Date;
  expiresAt?: Date;
};

type ValidateCouponInput = {
  code?: string | null;
  currency: PaymentCurrency;
  subtotalMinor: number;
  service?: (typeof serviceOptions)[number];
};

export type CouponValidationResult = {
  valid: boolean;
  code?: string;
  discountMinor: number;
  discountType?: CouponDiscountType;
  discountValue?: number;
  message: string;
};

const couponRegistry: Record<string, CouponConfig> = {
  BIZFYLR10: {
    code: "BIZFYLR10",
    active: true,
    discountType: "percentage",
    discountValue: 10,
    allowedCurrencies: ["INR", "USD"],
    applicableServices: serviceOptions,
    minSubtotalMinorByCurrency: { INR: 10_000, USD: 500 },
    maxDiscountMinorByCurrency: { INR: 500_000, USD: 5_000 }
  },
  WELCOME25: {
    code: "WELCOME25",
    active: true,
    discountType: "fixed",
    discountValue: 25,
    fixedAmountMinorByCurrency: { INR: 2500, USD: 2500 },
    allowedCurrencies: ["INR", "USD"],
    applicableServices: serviceOptions,
    minSubtotalMinorByCurrency: { INR: 2500, USD: 2500 }
  }
};

function normalizeCouponCode(code?: string | null) {
  return code?.trim().toUpperCase() ?? "";
}

export function validateCoupon(input: ValidateCouponInput): CouponValidationResult {
  const normalizedCode = normalizeCouponCode(input.code);

  if (!normalizedCode) {
    return {
      valid: false,
      discountMinor: 0,
      message: "Enter a coupon code to check whether it applies."
    };
  }

  const coupon = couponRegistry[normalizedCode];

  if (!coupon || !coupon.active) {
    return {
      valid: false,
      discountMinor: 0,
      message: "That coupon code is not active."
    };
  }

  if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) {
    return {
      valid: false,
      discountMinor: 0,
      message: "That coupon code has expired."
    };
  }

  if (coupon.startsAt && coupon.startsAt.getTime() > Date.now()) {
    return { valid: false, discountMinor: 0, message: "That coupon is not active yet." };
  }

  if (!coupon.allowedCurrencies.includes(input.currency)) {
    return {
      valid: false,
      discountMinor: 0,
      message: `That coupon is not available for ${input.currency} payments.`
    };
  }

  if (input.service && !coupon.applicableServices.includes(input.service)) {
    return { valid: false, discountMinor: 0, message: "That coupon does not apply to the selected service." };
  }

  const minimum = coupon.minSubtotalMinorByCurrency[input.currency] ?? 0;
  if (input.subtotalMinor < minimum) {
    return {
      valid: false,
      discountMinor: 0,
      message: "The order amount does not meet the coupon minimum."
    };
  }

  let discountMinor =
    coupon.discountType === "percentage"
      ? Math.round((input.subtotalMinor * Math.round(coupon.discountValue * 100)) / 10_000)
      : coupon.fixedAmountMinorByCurrency?.[input.currency] ?? 0;

  const maximum = coupon.maxDiscountMinorByCurrency?.[input.currency];
  if (maximum) {
    discountMinor = Math.min(discountMinor, maximum);
  }

  discountMinor = Math.max(0, Math.min(discountMinor, input.subtotalMinor));

  if (discountMinor <= 0) {
    return {
      valid: false,
      discountMinor: 0,
      message: "That coupon does not change the current total."
    };
  }

  return {
    valid: true,
    code: coupon.code,
    discountMinor,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    message: "Coupon applied successfully."
  };
}
