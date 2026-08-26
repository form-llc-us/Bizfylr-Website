import { SITE } from "@/data/site";

type TemplateResult = {
  subject: string;
  html: string;
  text: string;
};

type DetailRow = {
  label: string;
  value: string | number | null | undefined;
};

const fallbackUrl = "https://bizfylr.com";

function getFooterContext() {
  return {
    website: SITE.url || fallbackUrl,
    support: process.env.SUPPORT_REPLY_TO_EMAIL?.trim() || SITE.email
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "Not provided";
  }

  return String(value);
}

function renderRows(rows: DetailRow[]) {
  return rows
    .map((row) => {
      const value = escapeHtml(normalizeValue(row.value));
      return `<tr><td style="padding:8px 12px;border:1px solid #23314f;color:#9aa8c7;font-weight:600;width:180px;">${escapeHtml(
        row.label
      )}</td><td style="padding:8px 12px;border:1px solid #23314f;color:#e8edf8;">${value}</td></tr>`;
    })
    .join("");
}

function renderTextRows(rows: DetailRow[]) {
  return rows.map((row) => `${row.label}: ${normalizeValue(row.value)}`).join("\n");
}

function renderLayout(input: {
  heading: string;
  intro: string;
  body?: string;
  rows?: DetailRow[];
  outro?: string;
}) {
  const footer = getFooterContext();
  const rows = input.rows?.length
    ? `<table style="width:100%;border-collapse:collapse;margin:20px 0 0;">${renderRows(input.rows)}</table>`
    : "";
  const body = input.body
    ? `<p style="margin:16px 0 0;color:#d0d9ef;line-height:1.7;">${escapeHtml(input.body)}</p>`
    : "";
  const outro = input.outro
    ? `<p style="margin:18px 0 0;color:#d0d9ef;line-height:1.7;">${escapeHtml(input.outro)}</p>`
    : "";

  return `
    <div style="background:#081426;padding:24px;font-family:Arial,sans-serif;">
      <div style="max-width:640px;margin:0 auto;background:#0f1d33;border:1px solid rgba(255,255,255,0.1);border-radius:18px;padding:28px;">
        <p style="margin:0 0 10px;color:#77a8ff;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">Bizfylr</p>
        <h1 style="margin:0;color:#ffffff;font-size:28px;line-height:1.15;">${escapeHtml(input.heading)}</h1>
        <p style="margin:16px 0 0;color:#d0d9ef;line-height:1.7;">${escapeHtml(input.intro)}</p>
        ${body}
        ${rows}
        ${outro}
        <div style="margin-top:24px;padding-top:18px;border-top:1px solid rgba(255,255,255,0.08);color:#9aa8c7;font-size:13px;line-height:1.7;">
          <div>Bizfylr</div>
          <div>Website: <a href="${escapeHtml(footer.website)}" style="color:#9fd0ff;">${escapeHtml(footer.website)}</a></div>
          <div>Support: <a href="mailto:${escapeHtml(footer.support)}" style="color:#9fd0ff;">${escapeHtml(footer.support)}</a></div>
        </div>
      </div>
    </div>
  `;
}

function renderTextTemplate(input: {
  heading: string;
  intro: string;
  rows?: DetailRow[];
  outro?: string;
}) {
  const footer = getFooterContext();

  return [
    input.heading,
    "",
    input.intro,
    input.rows?.length ? `\n${renderTextRows(input.rows)}` : "",
    input.outro ? `\n${input.outro}` : "",
    "",
    "Bizfylr",
    `Website: ${footer.website}`,
    `Support: ${footer.support}`
  ]
    .filter(Boolean)
    .join("\n");
}

export function contactAdminTemplate(data: {
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
}): TemplateResult {
  const rows: DetailRow[] = [
    { label: "Submission ID", value: data.submissionId },
    { label: "Name", value: data.name },
    { label: "Email", value: data.email },
    { label: "Phone", value: data.phone },
    { label: "Company", value: data.company },
    { label: "Service", value: data.service },
    { label: "Message", value: data.message },
    { label: "Source", value: data.source },
    { label: "Submitted", value: data.submittedAt },
    { label: "IP Address", value: data.ipAddress },
    { label: "User Agent", value: data.userAgent }
  ];

  return {
    subject: `New Bizfylr Lead: ${data.name} - ${data.service}`,
    html: renderLayout({
      heading: "New contact request received",
      intro: "A new Bizfylr lead has been saved successfully.",
      rows
    }),
    text: renderTextTemplate({
      heading: "New contact request received",
      intro: "A new Bizfylr lead has been saved successfully.",
      rows
    })
  };
}

export function contactClientTemplate(data: {
  name: string;
  service: string;
}): TemplateResult {
  return {
    subject: "We received your request - Bizfylr",
    html: renderLayout({
      heading: `Thanks, ${data.name}.`,
      intro: "Bizfylr has received your request and the team will review the details carefully.",
      body: `We noted your interest in ${data.service}. If anything important changes before we respond, reply to this email with the updated context.`
    }),
    text: renderTextTemplate({
      heading: `Thanks, ${data.name}.`,
      intro: "Bizfylr has received your request and the team will review the details carefully.",
      outro: `We noted your interest in ${data.service}. If anything important changes before we respond, reply to this email with the updated context.`
    })
  };
}

export function newsletterAdminTemplate(data: {
  subscriberId: string;
  email: string;
  source?: string;
  submittedAt: string;
}): TemplateResult {
  const rows: DetailRow[] = [
    { label: "Subscriber ID", value: data.subscriberId },
    { label: "Email", value: data.email },
    { label: "Source", value: data.source },
    { label: "Submitted", value: data.submittedAt }
  ];

  return {
    subject: "New Newsletter Subscriber - Bizfylr",
    html: renderLayout({
      heading: "New newsletter subscriber",
      intro: "A new newsletter subscription has been saved.",
      rows
    }),
    text: renderTextTemplate({
      heading: "New newsletter subscriber",
      intro: "A new newsletter subscription has been saved.",
      rows
    })
  };
}

export function newsletterClientTemplate(): TemplateResult {
  return {
    subject: "You're subscribed to Bizfylr updates",
    html: renderLayout({
      heading: "Subscription confirmed",
      intro: "You are now subscribed to Bizfylr updates.",
      body: "Expect occasional updates focused on practical business growth, launch execution, digital infrastructure, and founder support."
    }),
    text: renderTextTemplate({
      heading: "Subscription confirmed",
      intro: "You are now subscribed to Bizfylr updates.",
      outro: "Expect occasional updates focused on practical business growth, launch execution, digital infrastructure, and founder support."
    })
  };
}

export function paymentOrderCreatedAdminTemplate(data: {
  localOrderId: string;
  razorpayOrderId: string;
  service: string;
  name: string;
  email: string;
  phone: string;
  currency: string;
  subtotal: string;
  discount: string;
  couponCode?: string | null;
  gst: string;
  total: string;
  billingCountry?: string | null;
  billingState?: string | null;
  billingGstin?: string | null;
  billingCompany?: string | null;
}): TemplateResult {
  const rows: DetailRow[] = [
    { label: "Local order ID", value: data.localOrderId },
    { label: "Razorpay order ID", value: data.razorpayOrderId },
    { label: "Client", value: data.name },
    { label: "Email", value: data.email },
    { label: "Phone", value: data.phone },
    { label: "Service", value: data.service },
    { label: "Currency", value: data.currency },
    { label: "Subtotal", value: data.subtotal },
    { label: "Discount", value: data.discount },
    { label: "Coupon code", value: data.couponCode },
    { label: "GST", value: data.gst },
    { label: "Total payable", value: data.total },
    { label: "Billing company", value: data.billingCompany },
    { label: "Billing country", value: data.billingCountry },
    { label: "Billing state", value: data.billingState },
    { label: "GSTIN", value: data.billingGstin }
  ];

  return {
    subject: `Payment Order Created: ${data.service} - ${data.name}`,
    html: renderLayout({
      heading: "Payment order created",
      intro: "A Razorpay order has been created and saved locally.",
      rows
    }),
    text: renderTextTemplate({
      heading: "Payment order created",
      intro: "A Razorpay order has been created and saved locally.",
      rows
    })
  };
}

export function paymentVerifiedAdminTemplate(data: {
  localOrderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  service: string;
  name: string;
  email: string;
  phone: string;
  currency: string;
  total: string;
  discount: string;
  couponCode?: string | null;
  gst: string;
  verifiedAt: string;
}): TemplateResult {
  const rows: DetailRow[] = [
    { label: "Local order ID", value: data.localOrderId },
    { label: "Razorpay order ID", value: data.razorpayOrderId },
    { label: "Razorpay payment ID", value: data.razorpayPaymentId },
    { label: "Client", value: data.name },
    { label: "Email", value: data.email },
    { label: "Phone", value: data.phone },
    { label: "Service", value: data.service },
    { label: "Currency", value: data.currency },
    { label: "Paid amount", value: data.total },
    { label: "Discount", value: data.discount },
    { label: "Coupon code", value: data.couponCode },
    { label: "GST", value: data.gst },
    { label: "Verified at", value: data.verifiedAt }
  ];

  return {
    subject: `Payment Verified: ${data.service} - ${data.name}`,
    html: renderLayout({
      heading: "Payment verified successfully",
      intro: "A Bizfylr payment has been verified successfully.",
      rows
    }),
    text: renderTextTemplate({
      heading: "Payment verified successfully",
      intro: "A Bizfylr payment has been verified successfully.",
      rows
    })
  };
}

export function paymentVerifiedClientTemplate(data: {
  name: string;
  service: string;
  currency: string;
  total: string;
  discount: string;
  couponCode?: string | null;
  gst: string;
  razorpayPaymentId: string;
}): TemplateResult {
  const rows: DetailRow[] = [
    { label: "Service", value: data.service },
    { label: "Currency", value: data.currency },
    { label: "Amount paid", value: data.total },
    { label: "Discount", value: data.discount },
    { label: "Coupon code", value: data.couponCode },
    { label: "GST", value: data.gst },
    { label: "Razorpay payment ID", value: data.razorpayPaymentId }
  ];

  return {
    subject: "Payment confirmed - Bizfylr",
    html: renderLayout({
      heading: `Payment confirmed for ${data.name}`,
      intro: "Your Bizfylr payment was verified successfully.",
      rows,
      outro: "The Bizfylr team will review the payment and proceed with the next operational step."
    }),
    text: renderTextTemplate({
      heading: `Payment confirmed for ${data.name}`,
      intro: "Your Bizfylr payment was verified successfully.",
      rows,
      outro: "The Bizfylr team will review the payment and proceed with the next operational step."
    })
  };
}

export function paymentFailedAdminTemplate(data: {
  localOrderId?: string | null;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  clientName?: string | null;
  clientEmail?: string | null;
  reason: string;
  occurredAt: string;
}): TemplateResult {
  const rows: DetailRow[] = [
    { label: "Local order ID", value: data.localOrderId },
    { label: "Razorpay order ID", value: data.razorpayOrderId },
    { label: "Razorpay payment ID", value: data.razorpayPaymentId },
    { label: "Client name", value: data.clientName },
    { label: "Client email", value: data.clientEmail },
    { label: "Reason", value: data.reason },
    { label: "Occurred at", value: data.occurredAt }
  ];

  return {
    subject: "Payment Verification Failed - Bizfylr",
    html: renderLayout({
      heading: "Payment verification failed",
      intro: "A payment verification or confirmation step failed and should be reviewed.",
      rows
    }),
    text: renderTextTemplate({
      heading: "Payment verification failed",
      intro: "A payment verification or confirmation step failed and should be reviewed.",
      rows
    })
  };
}

export function paymentFailedClientTemplate(data: {
  name: string;
  service: string;
  reason: string;
  razorpayPaymentId?: string | null;
}): TemplateResult {
  const rows: DetailRow[] = [
    { label: "Service", value: data.service },
    { label: "Razorpay payment ID", value: data.razorpayPaymentId },
    { label: "Reason", value: data.reason }
  ];

  return {
    subject: "Payment could not be completed - Bizfylr",
    html: renderLayout({
      heading: `Payment update for ${data.name}`,
      intro: "Your Bizfylr payment could not be completed.",
      rows,
      outro: "No successful payment confirmation has been recorded for this attempt. You may retry the payment or contact Bizfylr support if the amount was debited."
    }),
    text: renderTextTemplate({
      heading: `Payment update for ${data.name}`,
      intro: "Your Bizfylr payment could not be completed.",
      rows,
      outro: "No successful payment confirmation has been recorded for this attempt. You may retry the payment or contact Bizfylr support if the amount was debited."
    })
  };
}
