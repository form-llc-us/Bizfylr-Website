"use client";

import { useId, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, serviceOptions, type ContactFormValues } from "@/lib/validations";

const contactDefaults: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "Business Expansion",
  budget: "",
  message: "",
  website: ""
};

export function ContactForm() {
  const formId = useId();
  const [values, setValues] = useState<ContactFormValues>(contactDefaults);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({});
  const [message, setMessage] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  function update<K extends keyof ContactFormValues>(key: K, value: ContactFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const result = contactSchema.safeParse(values);
    if (!result.success) {
      const nextErrors: Partial<Record<keyof ContactFormValues, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ContactFormValues;
        nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...result.data, source: "contact-page" })
        });
        const payload = (await response.json()) as { message?: string };
        if (!response.ok) {
          setMessage(payload.message ?? "Something went wrong.");
          return;
        }
        setValues(contactDefaults);
        setMessage("Thanks. Your message is in and our team will follow up soon.");
      } catch {
        setMessage("Something went wrong.");
      }
    });
  }

  const fieldIds = {
    name: `${formId}-name`,
    email: `${formId}-email`,
    phone: `${formId}-phone`,
    company: `${formId}-company`,
    service: `${formId}-service`,
    budget: `${formId}-budget`,
    message: `${formId}-message`,
    website: `${formId}-website`
  } as const;

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <ContactField error={errors.name} id={fieldIds.name} label="Name">
          <Input
            aria-describedby={errors.name ? `${fieldIds.name}-error` : undefined}
            aria-invalid={Boolean(errors.name)}
            id={fieldIds.name}
            onChange={(event) => update("name", event.target.value)}
            value={values.name}
          />
        </ContactField>
        <ContactField error={errors.email} id={fieldIds.email} label="Email">
          <Input
            aria-describedby={errors.email ? `${fieldIds.email}-error` : undefined}
            aria-invalid={Boolean(errors.email)}
            id={fieldIds.email}
            onChange={(event) => update("email", event.target.value)}
            type="email"
            value={values.email}
          />
        </ContactField>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ContactField error={errors.phone} id={fieldIds.phone} label="Phone">
          <Input
            aria-describedby={errors.phone ? `${fieldIds.phone}-error` : undefined}
            aria-invalid={Boolean(errors.phone)}
            id={fieldIds.phone}
            onChange={(event) => update("phone", event.target.value)}
            value={values.phone}
          />
        </ContactField>
        <ContactField error={errors.company} id={fieldIds.company} label="Company">
          <Input
            aria-describedby={errors.company ? `${fieldIds.company}-error` : undefined}
            aria-invalid={Boolean(errors.company)}
            id={fieldIds.company}
            onChange={(event) => update("company", event.target.value)}
            value={values.company}
          />
        </ContactField>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ContactField error={errors.service} id={fieldIds.service} label="Service interested in">
          <Select
            aria-describedby={errors.service ? `${fieldIds.service}-error` : undefined}
            aria-invalid={Boolean(errors.service)}
            id={fieldIds.service}
            onChange={(event) => update("service", event.target.value as ContactFormValues["service"])}
            value={values.service}
          >
            {serviceOptions.map((service) => (
              <option className="bg-surface text-foreground" key={service} value={service}>
                {service}
              </option>
            ))}
          </Select>
        </ContactField>
        <ContactField error={errors.budget} id={fieldIds.budget} label="Budget range">
          <Select
            aria-describedby={errors.budget ? `${fieldIds.budget}-error` : undefined}
            aria-invalid={Boolean(errors.budget)}
            id={fieldIds.budget}
            onChange={(event) => update("budget", event.target.value)}
            value={values.budget}
          >
            <option className="bg-surface text-foreground" value="">
              Select budget
            </option>
            <option className="bg-surface text-foreground" value="Under $500">
              Under $500
            </option>
            <option className="bg-surface text-foreground" value="$500 - $2,000">
              $500 - $2,000
            </option>
            <option className="bg-surface text-foreground" value="$2,000 - $5,000">
              $2,000 - $5,000
            </option>
            <option className="bg-surface text-foreground" value="$5,000+">
              $5,000+
            </option>
          </Select>
        </ContactField>
      </div>
      <ContactField error={errors.message} id={fieldIds.message} label="Message">
        <Textarea
          aria-describedby={errors.message ? `${fieldIds.message}-error` : undefined}
          aria-invalid={Boolean(errors.message)}
          id={fieldIds.message}
          onChange={(event) => update("message", event.target.value)}
          value={values.message}
        />
      </ContactField>
      <input
        aria-hidden="true"
        autoComplete="off"
        className="hidden"
        name="website"
        id={fieldIds.website}
        onChange={(event) => update("website", event.target.value)}
        tabIndex={-1}
        value={values.website}
      />
      <Button disabled={isPending} size="lg" type="submit">
        {isPending ? "Submitting..." : "Talk to Bizfylr"}
      </Button>
      {message ? (
        <p aria-live="polite" className="text-sm text-muted">
          {message}
        </p>
      ) : null}
    </form>
  );
}

function ContactField({
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
    <label className="grid gap-2 text-sm font-medium text-foreground">
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
