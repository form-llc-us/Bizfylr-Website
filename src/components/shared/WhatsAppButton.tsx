import { cn } from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/whatsapp";

type WhatsAppButtonProps = {
  variant?: "floating" | "inline";
  label?: string;
  message?: string;
  className?: string;
};

export function WhatsAppButton({
  variant = "floating",
  label = "WhatsApp",
  message,
  className
}: WhatsAppButtonProps) {
  const href = getWhatsAppUrl(message);

  return (
    <a
      aria-label={label}
      className={cn(
        variant === "floating"
          ? "inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_16px_40px_rgba(37,211,102,0.32)] ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#20BD5A] hover:shadow-[0_18px_44px_rgba(37,211,102,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          : "inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-background/90 text-foreground shadow-glow backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#25D366]/40 hover:bg-[#25D366]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <svg
        aria-hidden="true"
        className={cn(
          "shrink-0",
          variant === "floating"
            ? "h-5 w-5"
            : "h-4 w-4 text-[#25D366]"
        )}
        viewBox="0 0 32 32"
        fill="currentColor"
      >
        <path d="M16.002 2.667c-7.363 0-13.334 5.97-13.334 13.333 0 2.35.613 4.64 1.777 6.66L2.668 29.333l6.85-1.745a13.29 13.29 0 0 0 6.484 1.667c7.362 0 13.333-5.97 13.333-13.333S23.364 2.667 16.002 2.667Zm0 24.32a11.01 11.01 0 0 1-5.613-1.547l-.402-.238-4.064 1.035 1.084-3.953-.264-.417A10.97 10.97 0 0 1 5.002 16c0-6.075 4.924-11 11-11 6.075 0 11 4.925 11 11s-4.925 10.987-11 10.987Zm6.04-8.232c-.33-.165-1.956-.966-2.258-1.076-.303-.11-.523-.165-.743.165-.22.329-.852 1.075-1.045 1.295-.192.22-.385.247-.715.082-.33-.165-1.394-.514-2.655-1.638-.982-.875-1.645-1.956-1.837-2.286-.193-.33-.02-.508.145-.672.15-.149.33-.385.495-.577.165-.193.22-.33.33-.55.11-.22.055-.412-.027-.577-.083-.165-.743-1.79-1.018-2.45-.268-.643-.54-.555-.743-.566-.193-.01-.413-.012-.633-.012-.22 0-.577.082-.88.412-.303.33-1.155 1.13-1.155 2.754s1.182 3.194 1.347 3.414c.165.22 2.326 3.55 5.635 4.977.787.34 1.402.543 1.88.695.79.252 1.51.217 2.08.132.635-.095 1.956-.8 2.23-1.57.276-.772.276-1.433.193-1.57-.082-.138-.302-.22-.632-.385Z" />
      </svg>
    </a>
  );
}