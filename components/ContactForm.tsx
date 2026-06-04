"use client";

import { useState } from "react";
import { ArrowNE } from "./ui";

const FIELD =
  "w-full rounded-sm border border-line bg-black/40 px-4 py-3 text-ink-bright placeholder:text-ink-faint focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors";
const LABEL = "flex flex-col gap-2 text-sm text-ink-dim";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="flex flex-col gap-5"
    >
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
      <button type="submit" className="btn btn-primary w-fit" disabled={sent}>
        <span>{sent ? "Thanks — we'll be in touch" : "Send message"}</span>
        <ArrowNE />
      </button>
      {sent && (
        <p className="text-sm text-brand-light">
          This is a demo form. Wire it to your CRM / email endpoint before launch.
        </p>
      )}
    </form>
  );
}
