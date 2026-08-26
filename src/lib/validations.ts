import { z } from "zod";

export const serviceOptions = [
  "Business Expansion",
  "Business Compliance",
  "Website Development",
  "E-commerce Setup",
  "E-commerce Management",
  "Marketplace Setup",
  "Marketplace Operations",
  "Digital Marketing",
  "Graphic Design & Video Editing"
] as const;

export const paymentCurrencies = ["INR", "USD"] as const;

const optionalString = z.string().trim().max(200).optional().or(z.literal(""));

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z.email("Please enter a valid email address.").transform((value) => value.trim().toLowerCase()),
  phone: z
    .string()
    .trim()
    .min(8, "Please enter a valid phone number.")
    .max(20, "Please enter a valid phone number."),
  service: z.enum(serviceOptions),
  message: z.string().trim().min(12, "Tell us a bit more about your project.").max(1200),
  website: z.string().max(0).optional().default("")
});

export const contactSchema = leadSchema.extend({
  company: optionalString,
  budget: optionalString
});

export const newsletterSchema = z.object({
  email: z.email("Please enter a valid email address.").transform((value) => value.trim().toLowerCase()),
  website: z.string().max(0).optional().default("")
});

const optionalPaymentString = z.string().trim().max(200).optional().or(z.literal(""));

export const paymentSchema = z.object({
  service: z.enum(serviceOptions, "Please select a valid service."),
  amount: z.coerce.number().finite("Please enter a valid payment amount."),
  currency: z.enum(paymentCurrencies),
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z.email("Please enter a valid email address.").transform((value) => value.trim().toLowerCase()),
  phone: z.string().trim().min(8, "Please enter a valid phone number.").max(20),
  companyName: optionalPaymentString,
  billingCountry: z.string().trim().min(2, "Please select a billing country.").max(80),
  billingState: optionalPaymentString,
  billingGstin: z
    .string()
    .trim()
    .max(30, "GSTIN must be 30 characters or fewer.")
    .optional()
    .or(z.literal("")),
  billingAddress: z.string().trim().min(8, "Please enter the billing address or invoice note.").max(240),
  couponCode: z
    .string()
    .trim()
    .max(40, "Coupon codes must be 40 characters or fewer.")
    .optional()
    .or(z.literal(""))
}).strict();

export type LeadFormValues = z.infer<typeof leadSchema>;
export type ContactFormValues = z.infer<typeof contactSchema>;
export type NewsletterFormValues = z.infer<typeof newsletterSchema>;
export type PaymentFormValues = z.infer<typeof paymentSchema>;
