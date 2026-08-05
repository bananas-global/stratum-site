"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { requestLink, type SignInState } from "@/app/internal/sign-in/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      <span>{pending ? "Sending…" : "Email me a link"}</span>
    </button>
  );
}

export default function InternalSignInForm({
  expired,
  next,
  domain,
}: {
  expired?: boolean;
  next: string;
  domain: string;
}) {
  const [state, formAction] = useActionState<SignInState, FormData>(requestLink, {});

  if (state.sent) {
    return (
      <div className="max-w-md rounded-sm border border-line bg-black/40 p-6">
        <p className="text-ink-bright">
          {state.devLink ? "Dev mode — no email sent." : "Check your inbox."}
        </p>
        {state.devLink ? (
          // Only ever set when running `next dev` without a Resend key.
          <p className="mt-2 break-all text-sm text-ink-dim">
            Use this link (also printed in your terminal):{" "}
            <a href={state.devLink} className="text-brand-light underline">
              {state.devLink}
            </a>
          </p>
        ) : (
          // Deliberately non-committal: the same response comes back whether or
          // not the address is on the allowlist, so this never confirms who is.
          <p className="mt-2 text-sm text-ink-dim">
            If that address has access, a sign-in link is on its way. It expires
            in 15 minutes.
          </p>
        )}
      </div>
    );
  }

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-5">
      {expired && (
        <p className="text-sm text-ink-dim">
          That link has expired. Request a new one.
        </p>
      )}
      <div className="flex flex-col gap-2 text-sm text-ink-dim">
        <label htmlFor="internal-email">Work email</label>
        {/* Local part only — the domain is fixed and shown as a suffix, so
            there is less to type and the access policy is self-evident. An
            allowlisted outside address can still be typed in full. */}
        <div className="flex items-stretch overflow-hidden rounded-sm border border-line bg-black/40 transition-colors focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
          <input
            required
            autoFocus
            id="internal-email"
            type="text"
            name="email"
            placeholder="your.name"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-ink-bright placeholder:text-ink-faint focus:outline-none"
          />
          <span className="flex items-center border-l border-line bg-surface px-4 text-ink-faint">
            @{domain}
          </span>
        </div>
      </div>
      {/* Honeypot — offscreen, never focusable, ignored by screen readers. The
          data-*-ignore attributes keep 1Password/LastPass from autofilling it
          and locking a real person out of their own sign-in. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        data-1p-ignore
        data-lpignore="true"
        data-form-type="other"
        className="absolute left-[-9999px]"
      />
      <input type="hidden" name="next" value={next} />
      {state.error && (
        <p role="alert" className="text-sm text-brand-light">
          {state.error}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
