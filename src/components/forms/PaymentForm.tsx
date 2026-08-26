"use client";

import type { FormEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SITE } from "@/data/site";
import {
  paymentSchema,
  serviceOptions,
  type PaymentFormValues,
} from "@/lib/validations";
import { cn } from "@/lib/utils";

type CouponState = {
  code: string;
  discountMinor: number;
  valid: boolean;
  message: string;
  amount: number;
  currency: PaymentFormValues["currency"];
  billingCountry: string;
};

type PaymentBreakdownResponse = {
  subtotalMinor: number;
  discountMinor: number;
  taxableMinor: number;
  gstRate: number;
  gstAmountMinor: number;
  totalAmountMinor: number;
  couponCode?: string;
  taxLabel: string;
};

type DropdownOption = {
  label: string;
  value: string;
};

const paymentDefaults: PaymentFormValues = {
  service: "Business Expansion",
  amount: 0,
  currency: "USD",
  name: "",
  email: "",
  phone: "",
  companyName: "",
  billingCountry: "India",
  billingState: "",
  billingGstin: "",
  billingAddress: "",
  couponCode: "",
};

const currencyOptions: DropdownOption[] = [
  { label: "$ USD", value: "USD" },
  { label: "₹ INR", value: "INR" },
];

const countryOptions = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macau",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
  "Other",
];

const indiaStateOptions = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Other",
];

const usStateOptions = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
  "American Samoa",
  "Guam",
  "Northern Mariana Islands",
  "Puerto Rico",
  "U.S. Virgin Islands",
  "Other",
];

function toDropdownOptions(options: readonly string[]): DropdownOption[] {
  return options.map((option) => ({
    label: option,
    value: option,
  }));
}

function getBillingStateOptions(country: string) {
  const normalized = country.trim().toLowerCase();

  if (normalized === "india" || normalized === "in") {
    return indiaStateOptions;
  }

  if (
    normalized === "united states" ||
    normalized === "united states of america" ||
    normalized === "usa" ||
    normalized === "us"
  ) {
    return usStateOptions;
  }

  return ["Not applicable", "Other"];
}

declare global {
  interface Window {
    Razorpay?: new (options: {
      key: string;
      amount: number;
      currency: string;
      name: string;
      description: string;
      image?: string;
      order_id: string;
      prefill?: {
        name?: string;
        email?: string;
        contact?: string;
      };
      notes?: Record<string, string>;
      theme?: {
        color?: string;
      };
      modal?: {
        ondismiss?: () => void;
        backdropclose?: boolean;
        escape?: boolean;
        confirm_close?: boolean;
      };
      handler?: (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => void | Promise<void>;
    }) => {
      open: () => void;
    };
  }
}

function getSafeBillingCountry(value: string | undefined) {
  return value?.trim() || "India";
}

function isIndianCountry(value: string | undefined) {
  const normalized = getSafeBillingCountry(value).trim().toLowerCase();
  return normalized === "india" || normalized === "in";
}

function formatMinor(
  amountMinor: number,
  currency: PaymentFormValues["currency"]
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amountMinor / 100);
}

function estimateBreakdown(
  values: PaymentFormValues,
  couponState: CouponState | null
): PaymentBreakdownResponse {
  const couponCode = values.couponCode ?? "";
  const billingCountry = getSafeBillingCountry(values.billingCountry);

  const subtotalMinor =
    Number.isFinite(values.amount) && values.amount > 0
      ? Math.max(0, Math.round(values.amount * 100))
      : 0;

  const discountMinor =
    couponState &&
    couponState.valid &&
    couponState.code === couponCode.trim().toUpperCase() &&
    couponState.amount === values.amount &&
    couponState.currency === values.currency &&
    couponState.billingCountry === billingCountry.trim()
      ? couponState.discountMinor
      : 0;

  const taxableMinor = Math.max(0, subtotalMinor - discountMinor);

  const gstRate =
    values.currency === "INR" && isIndianCountry(billingCountry) ? 18 : 0;

  const gstAmountMinor = gstRate > 0 ? Math.round(taxableMinor * 0.18) : 0;
  const totalAmountMinor = Math.max(0, taxableMinor + gstAmountMinor);

  return {
    subtotalMinor,
    discountMinor,
    taxableMinor,
    gstRate,
    gstAmountMinor,
    totalAmountMinor,
    couponCode: discountMinor > 0 ? couponCode.trim().toUpperCase() : undefined,
    taxLabel: gstRate > 0 ? "GST (18%)" : "No GST applied",
  };
}

export function PaymentForm({ paymentEnabled }: { paymentEnabled: boolean }) {
  const router = useRouter();
  const formId = useId();

  const [values, setValues] = useState<PaymentFormValues>(paymentDefaults);
  const [message, setMessage] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [couponState, setCouponState] = useState<CouponState | null>(null);
  const [serverBreakdown, setServerBreakdown] =
    useState<PaymentBreakdownResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [scriptState, setScriptState] = useState<"idle" | "loading" | "ready" | "failed">(
    paymentEnabled ? "loading" : "idle"
  );
  const idempotencyKeyRef = useRef("");

  const estimatedBreakdown = estimateBreakdown(values, couponState);
  const visibleBreakdown = serverBreakdown ?? estimatedBreakdown;

  const couponCode = values.couponCode ?? "";
  const billingCountry = getSafeBillingCountry(values.billingCountry);
  const billingState = values.billingState ?? "";
  const billingGstin = values.billingGstin ?? "";
  const companyName = values.companyName ?? "";
  const billingAddress = values.billingAddress ?? "";

  const billingStateOptions = getBillingStateOptions(billingCountry);
  const isIndiaBilling = isIndianCountry(billingCountry);

  function update<K extends keyof PaymentFormValues>(
    key: K,
    value: PaymentFormValues[K]
  ) {
    idempotencyKeyRef.current = "";
    setServerBreakdown(null);
    setValues((current) => {
      const next = { ...current, [key]: value };

      if (key === "billingCountry") {
        next.billingState = "";
        next.billingGstin = "";
      }

      return next;
    });

    setMessage("");
    setServerBreakdown(null);

    if (
      ["amount", "currency", "billingCountry", "couponCode"].includes(
        String(key)
      )
    ) {
      setCouponState(null);
      setCouponMessage("");
    }
  }

  async function applyCoupon() {
    setCouponMessage("");

    if (!couponCode.trim()) {
      setCouponMessage("Enter a coupon code to check whether it applies.");
      return;
    }

    setIsApplyingCoupon(true);

    try {
      const response = await fetch("/api/payment/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode,
          amount: values.amount,
          currency: values.currency,
          billingCountry,
          service: values.service,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        valid?: boolean;
        code?: string;
        discountMinor?: number;
        message?: string;
      };

      if (!response.ok) {
        setCouponState(null);
        setCouponMessage(
          payload.message ?? "Unable to validate the coupon right now."
        );
        return;
      }

      setCouponMessage(payload.message ?? "");

      if (
        payload.valid &&
        payload.code &&
        typeof payload.discountMinor === "number"
      ) {
        setCouponState({
          code: payload.code,
          discountMinor: payload.discountMinor,
          valid: true,
          message: payload.message ?? "Coupon applied successfully.",
          amount: values.amount,
          currency: values.currency,
          billingCountry: billingCountry.trim(),
        });

        setValues((current) => ({
          ...current,
          couponCode: payload.code ?? current.couponCode,
        }));
      } else {
        setCouponState(null);
      }
    } catch {
      setCouponState(null);
      setCouponMessage("Unable to validate the coupon right now.");
    } finally {
      setIsApplyingCoupon(false);
    }
  }

  function removeCoupon() {
    setCouponState(null);
    setCouponMessage("");
    setServerBreakdown(null);
    setValues((current) => ({ ...current, couponCode: "" }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const result = paymentSchema.safeParse({
      ...values,
      billingCountry,
      billingState,
      billingGstin,
      billingAddress,
      companyName,
    });

    if (!result.success) {
      setMessage(
        result.error.issues[0]?.message ?? "Please complete the payment form."
      );
      return;
    }

    setIsSubmitting(true);

    if (scriptState !== "ready" || !window.Razorpay) {
      setMessage(
        scriptState === "failed"
          ? "Razorpay Checkout could not load. Please refresh and try again."
          : "Secure checkout is still loading. Please wait a moment."
      );
      setIsSubmitting(false);
      return;
    }
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = window.crypto.randomUUID();
    }

    try {
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKeyRef.current,
        },
        body: JSON.stringify(result.data),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        message?: string;
        orderId?: string;
        razorpayOrderId?: string;
        paymentEnabled?: boolean;
        amountMinor?: number;
        currency?: string;
        razorpayKeyId?: string;
        companyName?: string;
        description?: string;
        prefill?: {
          name?: string;
          email?: string;
          contact?: string;
        };
        notes?: Record<string, string>;
        breakdown?: PaymentBreakdownResponse;
        idempotencyKey?: string;
      };

      if (!response.ok || !payload.paymentEnabled) {
        setMessage(
          payload.message ??
            "Payments are unavailable right now. Please contact support."
        );
        return;
      }

      if (payload.breakdown) {
        setServerBreakdown(payload.breakdown);
      }
      if (payload.idempotencyKey) {
        idempotencyKeyRef.current = payload.idempotencyKey;
      }

      if (
        !window.Razorpay ||
        !payload.razorpayOrderId ||
        !payload.razorpayKeyId ||
        !payload.amountMinor ||
        !payload.currency
      ) {
        setMessage(
          "Razorpay checkout failed to initialize. Please refresh and try again."
        );
        return;
      }

      const razorpay = new window.Razorpay({
        key: payload.razorpayKeyId,
        amount: payload.amountMinor,
        currency: payload.currency,
        name: payload.companyName ?? "Bizfylr",
        description: payload.description ?? `${result.data.service} payment`,
        image: SITE.logo,
        order_id: payload.razorpayOrderId,
        prefill: payload.prefill,
        notes: payload.notes,
        theme: {
          color: "#1C6BFF",
        },
        modal: {
          confirm_close: true,
          ondismiss: () => {
            setCheckoutOpen(false);
            setMessage("Checkout was closed before payment verification.");
          },
        },
        handler: async (checkoutResponse) => {
          const verificationResponse = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(checkoutResponse),
          });

          const verificationPayload = (await verificationResponse.json().catch(
            () => ({})
          )) as {
            verified?: boolean;
            message?: string;
          };

          if (!verificationResponse.ok || !verificationPayload.verified) {
            setCheckoutOpen(false);
            setMessage(
              verificationPayload.message ?? "Payment verification failed."
            );
            return;
          }

          router.push("/thank-you?source=payment");
        },
      });

      setCheckoutOpen(true);
      razorpay.open();
    } catch {
      setMessage("Unable to create the payment order right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form aria-busy={isSubmitting || checkoutOpen} className="grid gap-6" onSubmit={handleSubmit}>
      {paymentEnabled ? (
        <Script
          id="razorpay-checkout"
          onError={() => {
            setScriptState("failed");
            setMessage("Razorpay Checkout could not load. Please refresh and try again.");
          }}
          onLoad={() => setScriptState("ready")}
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      ) : null}
      <div className="grid gap-5 lg:grid-cols-2">
        <FormBlock
          eyebrow="Step 1"
          title="Service details"
          description="Enter the approved service, currency, and payment amount."
        >
          <div className="grid gap-4">
            <PaymentField label="Service/package">
              <CustomDropdown
                options={toDropdownOptions(serviceOptions)}
                value={values.service ?? ""}
                onChange={(value) =>
                  update("service", value as PaymentFormValues["service"])
                }
                placeholder="Select service/package"
              />
            </PaymentField>

            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_130px]">
              <PaymentField label="Amount">
                <Input
                  min={0}
                  onChange={(event) =>
                    update("amount", Number(event.target.value))
                  }
                  placeholder="0"
                  step="0.01"
                  type="number"
                  value={
                    Number.isFinite(values.amount) ? String(values.amount) : ""
                  }
                />
              </PaymentField>

              <PaymentField label="Currency">
                <CustomDropdown
                  options={currencyOptions}
                  value={values.currency}
                  onChange={(value) =>
                    update(
                      "currency",
                      value as PaymentFormValues["currency"]
                    )
                  }
                  placeholder="Select currency"
                />
              </PaymentField>
            </div>

            <PaymentField label="Business / company name" optional>
              <Input
                onChange={(event) => update("companyName", event.target.value)}
                placeholder="Company name"
                value={companyName}
              />
            </PaymentField>
          </div>
        </FormBlock>

        <FormBlock
          eyebrow="Step 2"
          title="Client details"
          description="Add the client contact details for the payment record."
        >
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <PaymentField label="Client name">
                <Input
                  onChange={(event) => update("name", event.target.value)}
                  placeholder="Full name"
                  value={values.name}
                />
              </PaymentField>

              <PaymentField label="Email">
                <Input
                  onChange={(event) => update("email", event.target.value)}
                  placeholder="client@example.com"
                  type="email"
                  value={values.email}
                />
              </PaymentField>
            </div>

            <PaymentField label="Phone">
              <Input
                onChange={(event) => update("phone", event.target.value)}
                placeholder="Phone / WhatsApp number"
                value={values.phone}
              />
            </PaymentField>
          </div>
        </FormBlock>

        <FormBlock
          eyebrow="Step 3"
          title="Billing details"
          description="Select the billing location and add tax or invoice details where required."
        >
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <PaymentField label="Billing country">
                <CustomDropdown
                  options={toDropdownOptions(countryOptions)}
                  value={billingCountry}
                  onChange={(value) => update("billingCountry", value)}
                  placeholder="Select billing country"
                />
              </PaymentField>

              <PaymentField label="Billing state / region" optional>
                <CustomDropdown
                  options={toDropdownOptions(billingStateOptions)}
                  value={billingState}
                  onChange={(value) => update("billingState", value)}
                  placeholder="Select state / region"
                />
              </PaymentField>
            </div>

            <PaymentField
              label={isIndiaBilling ? "GSTIN" : "Tax ID / GSTIN"}
              optional
            >
              <Input
                onChange={(event) => update("billingGstin", event.target.value)}
                placeholder={
                  isIndiaBilling
                    ? "GSTIN, if applicable"
                    : "Tax ID, VAT, or GST number if applicable"
                }
                value={billingGstin}
              />
            </PaymentField>

            <PaymentField label="Billing address or invoice note">
              <Textarea
                className="min-h-[96px] resize-none"
                onChange={(event) =>
                  update("billingAddress", event.target.value)
                }
                placeholder="Add billing address, invoice note, or service reference..."
                value={billingAddress}
              />
            </PaymentField>
          </div>
        </FormBlock>

        <FormBlock
          eyebrow="Optional"
          title="Coupon code"
          description="Apply a valid coupon before continuing to payment."
        >
          <div className="grid gap-3">
            <PaymentField label="Coupon code">
              <Input
                onChange={(event) =>
                  update("couponCode", event.target.value.toUpperCase())
                }
                placeholder="Enter coupon code"
                value={couponCode}
              />
            </PaymentField>

            <div className="flex flex-wrap gap-2">
              <Button
                disabled={isApplyingCoupon || !couponCode.trim()}
                onClick={applyCoupon}
                type="button"
                variant="outline"
              >
                {isApplyingCoupon ? "Checking..." : "Apply coupon"}
              </Button>

              {couponState ? (
                <Button onClick={removeCoupon} type="button" variant="ghost">
                  Remove
                </Button>
              ) : null}
            </div>

            {couponMessage ? (
              <p className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm leading-6 text-muted">
                {couponMessage}
              </p>
            ) : null}
          </div>
        </FormBlock>
      </div>

      <div className="rounded-[28px] border border-primary-light/20 bg-primary-light/[0.045] p-5 transition duration-300 hover:border-primary-light/40 hover:bg-primary-light/[0.065] md:p-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-light">
              Invoice Summary
            </p>

            <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              Review payable amount
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Coupon, GST, and total payable amount are recalculated on the
              server before Razorpay checkout opens.
            </p>

            <div className="mt-5 grid gap-3 rounded-[22px] border border-white/10 bg-black/10 p-4">
              <SummaryRow
                currency={values.currency}
                label="Subtotal"
                value={visibleBreakdown.subtotalMinor}
              />

              <SummaryRow
                currency={values.currency}
                label="Discount"
                value={-visibleBreakdown.discountMinor}
              />

              <SummaryRow
                currency={values.currency}
                label="Taxable amount"
                value={visibleBreakdown.taxableMinor}
              />

              <SummaryRow
                currency={values.currency}
                label={
                  visibleBreakdown.gstRate > 0
                    ? visibleBreakdown.taxLabel
                    : "GST"
                }
                value={visibleBreakdown.gstAmountMinor}
              />

              <div className="mt-1 border-t border-white/10 pt-3">
                <SummaryRow
                  currency={values.currency}
                  emphasis
                  label="Total payable"
                  value={visibleBreakdown.totalAmountMinor}
                />
              </div>
            </div>
          </div>

          <div>
            <Button
              className="w-full"
              disabled={isSubmitting || checkoutOpen || !paymentEnabled || scriptState !== "ready"}
              size="lg"
              type="submit"
            >
              {checkoutOpen
                ? "Checkout open..."
                : isSubmitting
                  ? "Creating secure order..."
                : paymentEnabled
                  ? scriptState === "failed"
                    ? "Checkout unavailable"
                    : scriptState === "ready"
                      ? "Continue to Razorpay"
                      : "Loading secure checkout..."
                  : "Payments unavailable"}
            </Button>

            <p className="mt-3 text-center text-xs leading-5 text-muted">
              Secure checkout powered by Razorpay.
            </p>

            {message ? (
              <p
                aria-live="polite"
                className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm leading-6 text-muted"
                id={`${formId}-message`}
              >
                {message}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </form>
  );
}

function FormBlock({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="h-full rounded-[26px] border border-white/10 bg-white/[0.025] p-4 transition duration-300 hover:border-primary-light/35 hover:bg-white/[0.055] md:p-5">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-light">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      </div>

      {children}
    </section>
  );
}

function PaymentField({
  label,
  children,
  optional = false,
}: {
  label: string;
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <div className="grid gap-2 text-sm font-medium text-foreground">
      <div className="flex items-center justify-between gap-3">
        <span>{label}</span>

        {optional ? (
          <span className="text-xs font-medium text-muted">Optional</span>
        ) : null}
      </div>

      {children}
    </div>
  );
}

function CustomDropdown({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const listboxId = useId();
  const selectedOption = options.find((option) => option.value === value);
  const selectedLabel = selectedOption?.label ?? placeholder;

  return (
    <div className="relative">
      <button
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        type="button"
        onBlur={() => {
          setTimeout(() => setOpen(false), 120);
        }}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
          } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const direction = event.key === "ArrowDown" ? 1 : -1;
            setOpen(true);
            setActiveIndex((current) => (current + direction + options.length) % options.length);
          } else if (event.key === "Enter" && open) {
            event.preventDefault();
            const option = options[activeIndex];
            if (option) {
              onChange(option.value);
            }
            setOpen(false);
          }
        }}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-3 rounded-full border px-4 text-left text-sm font-medium transition duration-300",
          "border-white/10 bg-white/[0.055] text-foreground shadow-sm",
          "hover:border-primary-light/35 hover:bg-white/[0.075]",
          "focus-visible:border-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light/30",
          !value && "text-muted"
        )}
      >
        <span className="truncate">{selectedLabel}</span>

        <span
          className={cn(
            "text-muted transition duration-300",
            open && "rotate-180 text-primary-light"
          )}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {open ? (
        <div id={listboxId} role="listbox" className="absolute left-0 right-0 z-50 mt-2 max-h-64 overflow-y-auto rounded-[20px] border border-white/10 bg-surface p-1.5 shadow-2xl shadow-black/30">
          {options.map((option, index) => {
            const active = option.value === value;

            return (
              <button
                aria-selected={active}
                key={option.value}
                role="option"
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition duration-200",
                  active
                    ? "bg-primary-light/15 text-primary-light"
                    : "text-foreground hover:bg-white/[0.07]"
                )}
              >
                <span className="truncate">{option.label}</span>
                {active ? <span aria-hidden="true">✓</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  currency,
  emphasis = false,
}: {
  label: string;
  value: number;
  currency: PaymentFormValues["currency"];
  emphasis?: boolean;
}) {
  const displayValue =
    value < 0
      ? `- ${formatMinor(Math.abs(value), currency)}`
      : formatMinor(value, currency);

  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span
        className={
          emphasis ? "font-semibold text-foreground" : "text-foreground/80"
        }
      >
        {label}
      </span>

      <span
        className={
          emphasis
            ? "text-base font-semibold text-foreground"
            : "font-medium text-foreground"
        }
      >
        {displayValue}
      </span>
    </div>
  );
}
