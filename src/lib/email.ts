import nodemailer from "nodemailer";
import type { PaymentOrder } from "@prisma/client";

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
import { formatMinorCurrency } from "@/lib/payment";
import { logServerError } from "@/lib/server";

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

type SendEmailResult = {
  sent: boolean;
  skipped: boolean;
};

let warnedMissingSmtp = false;

function parseBoolean(value: string | undefined) {
  return value?.trim().toLowerCase() === "true";
}

function parseRecipients(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getEmailConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT ?? "0");
  const secure = parseBoolean(process.env.SMTP_SECURE);
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD?.trim();
  const fromName = process.env.SMTP_FROM_NAME?.trim() || "Bizfylr";
  const fromEmail = process.env.SMTP_FROM_EMAIL?.trim();
  const replyTo = process.env.SUPPORT_REPLY_TO_EMAIL?.trim();
  const adminRecipients = parseRecipients(process.env.ADMIN_NOTIFICATION_EMAIL);

  const configured = Boolean(host && port > 0 && fromEmail);

  return {
    configured,
    host,
    port,
    secure,
    user,
    password,
    fromName,
    fromEmail,
    replyTo,
    adminRecipients
  };
}

function getTransporter() {
  const config = getEmailConfig();

  if (!config.configured || !config.host || !config.fromEmail) {
    return null;
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.user && config.password ? { user: config.user, pass: config.password } : undefined
  });
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const config = getEmailConfig();
  const recipients = Array.isArray(input.to) ? input.to.filter(Boolean) : [input.to].filter(Boolean);

  if (!config.configured || !config.fromEmail || recipients.length === 0) {
    if (!warnedMissingSmtp) {
      warnedMissingSmtp = true;
      console.warn("[email] SMTP is not configured. Email sending will be skipped.");
    }

    return {
      sent: false,
      skipped: true
    };
  }

  const transporter = getTransporter();

  if (!transporter) {
    return {
      sent: false,
      skipped: true
    };
  }

  try {
    await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: recipients.join(", "),
      subject: input.subject.replace(/[\r\n]+/g, " ").trim(),
      html: input.html,
      text: input.text,
      replyTo: input.replyTo || config.replyTo || undefined
    });

    return {
      sent: true,
      skipped: false
    };
  } catch (error) {
    logServerError("email/send", error);
    return {
      sent: false,
      skipped: false
    };
  }
}

export async function sendAdminNotification(input: {
  subject: string;
  html: string;
  text: string;
}) {
  const config = getEmailConfig();
  return sendEmail({
    to: config.adminRecipients,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: config.replyTo
  });
}

export async function sendClientEmail(input: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}) {
  return sendEmail(input);
}

export async function sendContactSubmissionEmails(input: {
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
  const admin = contactAdminTemplate(input);
  const client = contactClientTemplate({
    name: input.name,
    service: input.service
  });

  await sendAdminNotification(admin);
  await sendClientEmail({
    to: input.email,
    subject: client.subject,
    html: client.html,
    text: client.text
  });
}

export async function sendNewsletterEmails(input: {
  subscriberId: string;
  email: string;
  source?: string;
  submittedAt: string;
}) {
  const admin = newsletterAdminTemplate(input);
  const client = newsletterClientTemplate();

  await sendAdminNotification(admin);
  await sendClientEmail({
    to: input.email,
    subject: client.subject,
    html: client.html,
    text: client.text
  });
}

function buildPaymentDisplay(order: PaymentOrder) {
  return {
    subtotal: formatMinorCurrency(order.subtotalMinor ?? order.amountMinor, order.currency as "INR" | "USD"),
    discount: formatMinorCurrency(order.discountMinor, order.currency as "INR" | "USD"),
    gst: formatMinorCurrency(order.gstAmountMinor, order.currency as "INR" | "USD"),
    total: formatMinorCurrency(order.totalAmountMinor ?? order.amountMinor, order.currency as "INR" | "USD")
  };
}

export async function sendPaymentOrderCreatedAdminEmail(order: PaymentOrder) {
  const display = buildPaymentDisplay(order);
  const template = paymentOrderCreatedAdminTemplate({
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

  return sendAdminNotification(template);
}

export async function sendPaymentVerifiedEmails(order: PaymentOrder) {
  const display = buildPaymentDisplay(order);
  const verifiedAt = (order.verifiedAt ?? order.paidAt ?? new Date()).toISOString();
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
    verifiedAt
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

  const [adminResult, clientResult] = await Promise.all([
    sendAdminNotification(admin),
    sendClientEmail({
      to: order.billingEmail,
      subject: client.subject,
      html: client.html,
      text: client.text
    })
  ]);

  return {
    sent: adminResult.sent && clientResult.sent,
    skipped: adminResult.skipped || clientResult.skipped
  };
}

export async function sendPaymentFailedAdminEmail(input: {
  order?: PaymentOrder | null;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  reason: string;
}) {
  const template = paymentFailedAdminTemplate({
    localOrderId: input.order?.id,
    razorpayOrderId: input.razorpayOrderId ?? input.order?.providerOrderId,
    razorpayPaymentId: input.razorpayPaymentId ?? input.order?.providerPaymentId,
    clientName: input.order?.billingName,
    clientEmail: input.order?.billingEmail,
    reason: input.reason,
    occurredAt: new Date().toISOString()
  });

  return sendAdminNotification(template);
}

export async function sendPaymentFailedEmails(input: {
  order?: PaymentOrder | null;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  reason: string;
}) {
  const admin = await sendPaymentFailedAdminEmail(input);

  if (!input.order?.billingEmail) {
    return admin;
  }

  const client = paymentFailedClientTemplate({
    name: input.order.billingName,
    service: input.order.service,
    reason: input.reason,
    razorpayPaymentId: input.razorpayPaymentId ?? input.order.providerPaymentId
  });

  const clientResult = await sendClientEmail({
    to: input.order.billingEmail,
    subject: client.subject,
    html: client.html,
    text: client.text
  });

  return {
    sent: admin.sent && clientResult.sent,
    skipped: admin.skipped || clientResult.skipped
  };
}
