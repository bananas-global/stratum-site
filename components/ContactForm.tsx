"use client";

import { useState } from "react";
import { ArrowNE } from "./ui";
import { SITE } from "@/lib/site";

const FIELD =
  "w-full rounded-sm border border-line bg-black/40 px-4 py-3 text-ink-bright placeholder:text-ink-faint focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors";
const LABEL = "flex flex-col gap-2 text-sm text-ink-dim";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending" || status === "sent") return;
    setStatus("sending");

    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      setStatus("sent");
      // GA4 conversion event — no-op when analytics isn't loaded.
      (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag?.(
        "event",
        "generate_lead",
        { form: "contact" },
      );
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={LABEL}>
          First name
          <input required type="text" name="firstName" className={FIELD} />
        </label>
        <label className={LABEL}>
          Last name
          <input required type="text" name="lastName" className={FIELD} />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={LABEL}>
          Work email
          <input required type="email" name="email" className={FIELD} />
        </label>
        <label className={LABEL}>
          Phone
          <input type="tel" name="phone" className={FIELD} />
        </label>
      </div>
      <label className={LABEL}>
        Company
        <input type="text" name="company" className={FIELD} />
      </label>
      <label className={LABEL}>
        What are you looking for?
        <select name="interest" className={FIELD} defaultValue="">
          <option value="" disabled>
            Select an option
          </option>
          <option>Managed IT</option>
          <option>Cybersecurity</option>
          <option>Business Systems</option>
          <option>Backup &amp; Recovery</option>
          <option>Project / Implementation</option>
          <option>Not sure yet</option>
        </select>
      </label>
      <label className={LABEL}>
        Tell us a bit about your environment or situation
        <textarea
          name="message"
          rows={5}
          placeholder="Industry, team size, sites, current support, security concerns, timeline..."
          className={FIELD}
        />
      </label>
      {/* Honeypot — hidden from real users, bots tend to fill every field. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button
        type="submit"
        className="btn btn-primary w-fit"
        disabled={status === "sending" || status === "sent"}
      >
        <span>
          {status === "sending"
            ? "Sending…"
            : status === "sent"
              ? "Thanks — we'll be in touch"
              : "Send message"}
        </span>
        <ArrowNE />
      </button>
      <p aria-live="polite" className="min-h-5 text-sm">
        {status === "sent" && (
          <span className="text-brand-light">
            Your message is on its way. We typically respond within one business day.
          </span>
        )}
        {status === "error" && (
          <span className="text-ink-dim">
            Something went wrong sending your message. Please try again, or email
            us directly at{" "}
            <a href={`mailto:${SITE.email}`} className="text-brand-light underline">
              {SITE.email}
            </a>
            .
          </span>
        )}
      </p>
    </form>
  );
}
