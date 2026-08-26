const defaultSiteUrl = "https://bizfylr.com";
const defaultWhatsAppMessage =
  "Hello Bizfylr team, I am interested in your services. Please guide me.";

function sanitizeWhatsAppNumber(value: string | undefined) {
  return (value ?? "").replace(/\D/g, "");
}

function buildWhatsAppUrl(number: string, message: string) {
  const safeNumber = sanitizeWhatsAppNumber(number);
  const encodedMessage = encodeURIComponent(message.trim());
  return safeNumber ? `https://wa.me/${safeNumber}?text=${encodedMessage}` : "#";
}

function normalizeSiteUrl(value: string | undefined) {
  const fallback = defaultSiteUrl;
  const raw = value?.trim() || fallback;

  try {
    const normalized = new URL(raw);
    normalized.pathname = "";
    normalized.search = "";
    normalized.hash = "";
    return normalized.toString().replace(/\/$/, "");
  } catch {
    return fallback;
  }
}

const whatsappNumber =
  sanitizeWhatsAppNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) || "916202619173";
const whatsappDisplay = process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY?.trim() || "+91 62026 19173";
const whatsappMessage =
  process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE?.trim() || defaultWhatsAppMessage;

export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME?.trim() || "Bizfylr",
  legalName: "Bizfylr Solutions Private Limited",
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  email: "support@bizfylr.com",
  phone: whatsappDisplay,
  address: {
    streetAddress: "5th Floor, Maurya Lok Complex, Block A",
    city: "Patna",
    region: "Bihar",
    postalCode: "800001",
    country: "India",
    countryCode: "IN"
  },
  description:
    "Bizfylr helps founders launch, automate, and scale global-ready businesses with premium websites, e-commerce systems, compliance support, and growth infrastructure.",

  // Keep your logo file here:
  // public/images/logo.png
  logo: "/images/logo.png",

  socials: {
    facebook: "https://www.facebook.com/people/Bizfylr/61572299797680/",
    instagram: "https://www.instagram.com/bizfylr/profilecard/?igsh=MTJ1OGVnbjVoYTQwbA%3D%3D",
    linkedin: "",
    x: "",
    youtube: "",
    whatsapp: buildWhatsAppUrl(whatsappNumber, whatsappMessage)
  },
  consultationUrl: "https://calendly.com/formllc11/30min",
  phoneHref: `tel:+${whatsappNumber}`,
  whatsapp: {
    number: whatsappNumber,
    display: whatsappDisplay,
    defaultMessage: whatsappMessage
  },
  whatsappUrl: buildWhatsAppUrl(whatsappNumber, whatsappMessage),
  primaryCtaLabel: "Book Free Consultation"
} as const;
