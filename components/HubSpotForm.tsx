"use client";

import { useEffect, useRef } from "react";
import { HUBSPOT_PORTAL_ID, HUBSPOT_REGION } from "./HubSpotTracking";

/**
 * HubSpot-hosted contact form (forms v2 embed), replacing our own ContactForm.
 * Leads land directly in the HubSpot CRM — that routing is the whole point of
 * the switch; the tracking script alone cannot send submissions anywhere.
 *
 * Trade-off accepted deliberately: HubSpot renders its own markup, so this will
 * never match the design system as closely as ContactForm did, and submissions
 * no longer flow through /api/contact → Resend. To revert, drop <ContactForm />
 * back into app/contact/page.tsx (the component is still in the repo, unused).
 */
const FORM_ID = "4f3ae6b0-9977-40ef-a957-bb49f0ae8a2e";
const EMBED_SRC = `//js-${HUBSPOT_REGION}.hsforms.net/forms/embed/v2.js`;

declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (opts: {
          portalId: string;
          formId: string;
          region: string;
          target: string;
          css?: string;
        }) => void;
      };
    };
  }
}

export default function HubSpotForm() {
  // Guards against a second form being created when React re-runs the effect
  // (dev strict mode, or a remount) — hbspt.forms.create appends, it doesn't replace.
  const created = useRef(false);

  useEffect(() => {
    const create = () => {
      if (created.current || !window.hbspt) return;
      created.current = true;
      window.hbspt.forms.create({
        portalId: HUBSPOT_PORTAL_ID,
        formId: FORM_ID,
        region: HUBSPOT_REGION,
        target: "#hubspot-contact-form",
        // Empty `css` is what makes HubSpot render into our DOM instead of an
        // iframe. Without it the form is sandboxed and no page CSS reaches it,
        // so the .hs-form-frame rules in globals.css would silently do nothing.
        css: "",
      });
    };

    if (window.hbspt) {
      create();
      return;
    }

    // The embed script may already be in flight from a previous mount.
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${EMBED_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", create);
      return () => existing.removeEventListener("load", create);
    }

    const script = document.createElement("script");
    script.src = EMBED_SRC;
    script.charset = "utf-8";
    script.async = true;
    script.addEventListener("load", create);
    document.body.appendChild(script);
    return () => script.removeEventListener("load", create);
  }, []);

  // Styled by #hubspot-contact-form rules in globals.css — the ID, not a class,
  // because HubSpot's own stylesheet loads after ours and outranks class selectors.
  return <div id="hubspot-contact-form" />;
}
