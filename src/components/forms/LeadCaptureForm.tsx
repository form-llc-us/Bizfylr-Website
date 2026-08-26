"use client";

import { useId, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/shared/GlassCard";
import { leadSchema, serviceOptions, type LeadFormValues } from "@/lib/validations";

const defaultValues: LeadFormValues = {
  name: "",
  email: "",
  phone: "",
  service: "Business Expansion",
  message: "",
  website: ""
};

export function LeadCaptureForm() {
  const formId = useId();
  const [values, setValues] = useState<LeadFormValues>(defaultValues);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormValues, string>>>({});
  const [serverMessage, setServerMessage] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  function update<K extends keyof LeadFormValues>(key: K, value: LeadFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerMessage("");

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

    startTransition(async () => {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ ...result.data, source: "lead-capture" })
        });

        const payload = (await response.json()) as { message?: string };
        if (!response.ok) {
          setServerMessage(payload.message ?? "Unable to submit the form right now.");
          return;
        }

        setValues(defaultValues);
        setServerMessage("Thanks. Our team will reach out with the right solution.");
      } catch {
        setServerMessage("Unable to submit the form right now.");
      }
    });
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
    <GlassCard className="overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-primary via-primary-light to-emerald" />
      <form className="space-y-4 p-6 md:p-7" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-light">Growth Consultation</p>
          <h3 className="font-heading text-2xl font-extrabold tracking-[-0.04em] text-foreground">
            Get a founder-focused plan.
          </h3>
          <p className="text-sm leading-6 text-muted">
            No spam. Our team will contact you with the right solution.
          </p>
        </div>
        <FormField error={errors.name} id={fieldIds.name} label="Name">
          <Input
            aria-describedby={errors.name ? `${fieldIds.name}-error` : undefined}
            aria-invalid={Boolean(errors.name)}
            id={fieldIds.name}
            name="name"
            onChange={(event) => update("name", event.target.value)}
            placeholder="Enter your name"
            value={values.name}
          />
        </FormField>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField error={errors.email} id={fieldIds.email} label="Email">
            <Input
              aria-describedby={errors.email ? `${fieldIds.email}-error` : undefined}
              aria-invalid={Boolean(errors.email)}
              id={fieldIds.email}
              name="email"
              onChange={(event) => update("email", event.target.value)}
              placeholder="you@example.com"
              type="email"
              value={values.email}
            />
          </FormField>
          <FormField error={errors.phone} id={fieldIds.phone} label="Phone">
            <Input
              aria-describedby={errors.phone ? `${fieldIds.phone}-error` : undefined}
              aria-invalid={Boolean(errors.phone)}
              id={fieldIds.phone}
              name="phone"
              onChange={(event) => update("phone", event.target.value)}
              placeholder="+91 98765 43210"
              value={values.phone}
            />
          </FormField>
        </div>
        <FormField error={errors.service} id={fieldIds.service} label="Service interested in">
          <Select
            aria-describedby={errors.service ? `${fieldIds.service}-error` : undefined}
            aria-invalid={Boolean(errors.service)}
            id={fieldIds.service}
            name="service"
            onChange={(event) => update("service", event.target.value as LeadFormValues["service"])}
            value={values.service}
          >
            {serviceOptions.map((service) => (
              <option className="bg-surface text-foreground" key={service} value={service}>
                {service}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField error={errors.message} id={fieldIds.message} label="Message">
          <Textarea
            aria-describedby={errors.message ? `${fieldIds.message}-error` : undefined}
            aria-invalid={Boolean(errors.message)}
            id={fieldIds.message}
            name="message"
            onChange={(event) => update("message", event.target.value)}
            placeholder="Tell us what you want to build, launch, or improve."
            value={values.message}
          />
        </FormField>
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
        <Button className="w-full" disabled={isPending} size="lg" type="submit">
          {isPending ? "Submitting..." : "Get Free Growth Consultation"}
        </Button>
        {serverMessage ? (
          <p aria-live="polite" className="text-sm text-muted">
            {serverMessage}
          </p>
        ) : null}
      </form>
    </GlassCard>
  );
}

function FormField({
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
    <label className="block space-y-2 text-sm text-foreground">
      <span className="font-medium">{label}</span>
      {children}
      {error ? (
        <span className="block text-xs text-red-300" id={`${id}-error`}>
          {error}
        </span>
      ) : null}
    </label>
  );
}
