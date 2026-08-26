"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SITE } from "@/data/site";
import { leadSchema, serviceOptions, type LeadFormValues } from "@/lib/validations";

const popupDefaults: LeadFormValues = {
  name: "",
  email: "",
  phone: "",
  service: "Business Expansion",
  message: "",
  website: ""
};

const DISMISSED_KEY = "bizfylr-consultation-popup-dismissed";
const hiddenRoutes = [
  "/admin",
  "/dashboard",
  "/api",
  "/checkout",
  "/payment",
  "/thank-you",
  "/privacy-policy",
  "/refund-policy",
  "/terms-of-service"
] as const;

export function ConsultationPopup() {
  const pathname = usePathname() ?? "";
  const rawFormId = useId();
  const formId = rawFormId.replace(/:/g, "");
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<LeadFormValues>(popupDefaults);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormValues, string>>>({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shouldBlockPopup = useMemo(
    () => hiddenRoutes.some((route) => pathname.startsWith(route)),
    [pathname]
  );

  useEffect(() => {
    if (shouldBlockPopup) {
      return;
    }

    if (window.sessionStorage.getItem(DISMISSED_KEY) === "true") {
      return;
    }

    const timeout = window.setTimeout(() => {
      setOpen(true);
    }, 1800);

    return () => window.clearTimeout(timeout);
  }, [pathname, shouldBlockPopup]);

  const handleClose = useCallback(() => {
    setOpen(false);
    window.sessionStorage.setItem(DISMISSED_KEY, "true");
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [handleClose, open]);

  function update<K extends keyof LeadFormValues>(key: K, value: LeadFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const result = leadSchema.safeParse(values);
    if (!result.success) {
      const nextErrors: Partial<Record<keyof LeadFormValues, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LeadFormValues;
        nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...result.data, source: "lead-popup" })
      });

      const payload = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) {
        setMessage(payload.message ?? "Unable to submit the request right now.");
        return;
      }

      setValues(popupDefaults);
      setMessage("Thanks. Your consultation request has been received.");
      window.sessionStorage.setItem(DISMISSED_KEY, "true");
      window.setTimeout(() => setOpen(false), 1400);
    } catch {
      setMessage("Unable to submit the request right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (shouldBlockPopup) {
    return null;
  }

  const fieldIds = {
    name: `${formId}-name`,
    email: `${formId}-email`,
    phone: `${formId}-phone`,
    service: `${formId}-service`,
    message: `${formId}-message`,
    website: `${formId}-website`
  } as const;

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-background/72 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={handleClose}
            role="presentation"
          />

          <div className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              aria-labelledby={`${formId}-title`}
              aria-modal="true"
              className="pointer-events-auto w-full max-w-[400px]"
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              role="dialog"
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-[18px] border border-white/12 bg-surface/95 shadow-glow backdrop-blur-xl">
                <div className="relative border-b border-white/10 px-4 py-3.5 text-center">
                  <button
                    aria-label="Close consultation popup"
                    className="absolute right-3 top-3 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/5 text-muted transition-colors hover:text-foreground"
                    onClick={handleClose}
                    type="button"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  <div className="mx-auto max-w-[20rem] space-y-1.5 px-6">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-primary-light">
                      Free consultation
                    </p>
                    <div className="space-y-1.5">
                      <h2
                        className="font-heading text-lg font-extrabold tracking-[-0.04em] text-foreground sm:text-xl"
                        id={`${formId}-title`}
                      >
                        Request a quick project review
                      </h2>
                      <p className="text-sm leading-6 text-muted">
                        Share your goal and Bizfylr will recommend the right next step.
                      </p>
                    </div>
                  </div>
                </div>

                <form className="grid gap-3 px-4 py-4" onSubmit={handleSubmit}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <PopupField error={errors.name} id={fieldIds.name} label="Name">
                      <Input
                        aria-describedby={errors.name ? `${fieldIds.name}-error` : undefined}
                        aria-invalid={Boolean(errors.name)}
                        id={fieldIds.name}
                        onChange={(event) => update("name", event.target.value)}
                        placeholder="Enter your name"
                        value={values.name}
                      />
                    </PopupField>
                    <PopupField error={errors.email} id={fieldIds.email} label="Email">
                      <Input
                        aria-describedby={errors.email ? `${fieldIds.email}-error` : undefined}
                        aria-invalid={Boolean(errors.email)}
                        id={fieldIds.email}
                        onChange={(event) => update("email", event.target.value)}
                        placeholder="you@example.com"
                        type="email"
                        value={values.email}
                      />
                    </PopupField>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <PopupField error={errors.phone} id={fieldIds.phone} label="Phone">
                      <Input
                        aria-describedby={errors.phone ? `${fieldIds.phone}-error` : undefined}
                        aria-invalid={Boolean(errors.phone)}
                        id={fieldIds.phone}
                        onChange={(event) => update("phone", event.target.value)}
                        placeholder="+91 98765 43210"
                        value={values.phone}
                      />
                    </PopupField>
                    <PopupField error={errors.service} id={fieldIds.service} label="Service">
                      <Select
                        aria-describedby={errors.service ? `${fieldIds.service}-error` : undefined}
                        aria-invalid={Boolean(errors.service)}
                        id={fieldIds.service}
                        onChange={(event) => update("service", event.target.value as LeadFormValues["service"])}
                        value={values.service}
                      >
                        {serviceOptions.map((service) => (
                          <option className="bg-surface text-foreground" key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </Select>
                    </PopupField>
                  </div>

                  <PopupField error={errors.message} id={fieldIds.message} label="Project brief">
                    <Textarea
                      aria-describedby={errors.message ? `${fieldIds.message}-error` : undefined}
                      aria-invalid={Boolean(errors.message)}
                      className="min-h-[76px]"
                      id={fieldIds.message}
                      onChange={(event) => update("message", event.target.value)}
                      placeholder="Tell us what you want to launch, improve, or automate."
                      value={values.message}
                    />
                  </PopupField>

                  <input
                    aria-hidden="true"
                    autoComplete="off"
                    className="hidden"
                    id={fieldIds.website}
                    name="website"
                    onChange={(event) => update("website", event.target.value)}
                    tabIndex={-1}
                    value={values.website}
                  />

                  <div className="rounded-[20px] border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-muted">
                    <p className="flex items-center justify-center gap-2 text-center leading-6">
                      <CalendarDays className="h-4 w-4 text-primary-light" />
                      Prefer direct scheduling?{" "}
                      <a
                        className="font-semibold text-primary-light transition-colors hover:text-foreground"
                        href={SITE.consultationUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Open calendar
                      </a>
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-2 text-center">
                    <p className="text-sm leading-6 text-muted">
                      No spam. A human follows up with the next step.
                    </p>
                    <Button className="w-full sm:w-auto" disabled={isSubmitting} size="default" type="submit">
                      {isSubmitting ? "Submitting..." : "Request Consultation"}
                    </Button>
                  </div>

                  {message ? (
                    <p aria-live="polite" className="text-center text-sm text-muted">
                      {message}
                    </p>
                  ) : null}
                </form>
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function PopupField({
  id,
  label,
  error,
  children
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-foreground">
      <span>{label}</span>
      {children}
      {error ? (
        <span className="text-xs text-red-300" id={`${id}-error`}>
          {error}
        </span>
      ) : null}
    </label>
  );
}
