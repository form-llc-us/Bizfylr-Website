import { SITE } from "@/data/site";

function sanitizeWhatsAppNumber(value: string) {
  return value.replace(/\D/g, "");
}

export function getWhatsAppUrl(message?: string) {
  const number = sanitizeWhatsAppNumber(SITE.whatsapp.number);
  const text = (message?.trim() || SITE.whatsapp.defaultMessage).trim();

  if (!number) {
    return "#";
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
