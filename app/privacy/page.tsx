import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import CTABand from "@/components/CTABand";
import { SITE, jsonLd } from "@/lib/site";
import { pageMeta, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Privacy Policy — Stratum",
  description:
    "How Stratum collects, uses, discloses, and protects personal information, in compliance with British Columbia's Personal Information Protection Act (PIPA).",
  path: "/privacy",
  ogTitle: "Privacy Policy — Stratum",
  ogDescription:
    "How Stratum collects, uses, discloses, and protects personal information under BC's Personal Information Protection Act (PIPA).",
});

const LAST_UPDATED = "June 2026";

type Section = {
  id: string;
  title: string;
  body: React.ReactNode;
};

const SECTIONS: Section[] = [
  {
    id: "scope",
    title: "Scope of this policy",
    body: (
      <>
        <p>
          This policy applies to {SITE.legalName} (&ldquo;Stratum,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) and governs
          the personal information we collect through our services, our website at stratumtech.ca, and our day-to-day work
          as a managed technology partner. We are based in the Lower Mainland, British Columbia, and we handle personal
          information in accordance with BC&rsquo;s <strong>Personal Information Protection Act (PIPA)</strong>.
        </p>
        <p>
          By engaging Stratum or using our website, you consent to the collection, use, and disclosure of your personal
          information as described here. If you do not agree with this policy, please do not use our website or services.
        </p>
      </>
    ),
  },
  {
    id: "definitions",
    title: "Key definitions",
    body: (
      <>
        <p>
          <strong>Personal information</strong> means information about an identifiable individual — for example a name,
          home address, personal email, or phone number. It does not include business contact information used solely to
          reach someone in their professional capacity (name, title, business address, business phone), which PIPA treats
          separately.
        </p>
        <p>
          Our <strong>Privacy Officer</strong> is responsible for ensuring Stratum complies with this policy and with
          PIPA. You can reach the Privacy Officer using the contact details at the end of this page.
        </p>
      </>
    ),
  },
  {
    id: "collection",
    title: "Information we collect",
    body: (
      <>
        <p>We only collect personal information that is reasonable and necessary to:</p>
        <ul>
          <li>Understand a client&rsquo;s needs and preferences;</li>
          <li>Deliver the products, services, and support a client has requested;</li>
          <li>Maintain a high standard of service and meet our contractual and legal obligations.</li>
        </ul>
        <p>Depending on how you interact with us, this may include:</p>
        <ul>
          <li>
            <strong>Contact and account details</strong> you provide — name, email, phone number, company, and the
            content of messages you send us (for example through our contact form or by email).
          </li>
          <li>
            <strong>Service and support information</strong> generated while we manage your technology environment,
            including support tickets, configuration details, and records needed to deliver our services.
          </li>
          <li>
            <strong>Website and usage data</strong> collected automatically when you visit stratumtech.ca, such as IP
            address, browser type, pages viewed, and referring pages — typically through cookies and analytics.
          </li>
        </ul>
        <p>We identify the purposes for collecting personal information at or before the time we collect it.</p>
      </>
    ),
  },
  {
    id: "use",
    title: "How we use your information",
    body: (
      <>
        <p>We use personal information to:</p>
        <ul>
          <li>Respond to enquiries and provide the services or information you request;</li>
          <li>Deliver, manage, support, and improve our services;</li>
          <li>Communicate with you about your account, service updates, and operational matters;</li>
          <li>Send occasional surveys or relevant business communications, where permitted;</li>
          <li>Operate, secure, and improve our website;</li>
          <li>Meet legal, regulatory, and contractual requirements.</li>
        </ul>
        <p>
          We will not use or disclose your personal information for any additional purpose without obtaining your consent,
          unless we are authorized or required to do so by law.
        </p>
      </>
    ),
  },
  {
    id: "consent",
    title: "Consent",
    body: (
      <>
        <p>
          We obtain consent to collect, use, or disclose personal information except where we are authorized to proceed
          without it. Consent may be given orally, in writing, electronically, or implied where the purpose is obvious and
          you voluntarily provide the information.
        </p>
        <p>
          You may withhold or withdraw consent at any time, subject to legal or contractual limits and reasonable notice.
          In some cases, withdrawing consent may limit our ability to provide a service to you.
        </p>
        <p>
          PIPA permits collection, use, or disclosure without consent in limited circumstances — for example where it is
          authorized or required by law, necessary to respond to an emergency that threatens life or health, the
          information is already publicly available, or it is needed to investigate a breach of an agreement, collect a
          debt, prevent fraud, or obtain legal advice.
        </p>
      </>
    ),
  },
  {
    id: "disclosure",
    title: "Disclosure and third parties",
    body: (
      <>
        <p>
          We do not sell your personal information. We may share it with trusted service providers who help us operate our
          business and deliver our services — for example, cloud hosting, software, and analytics providers — and only to
          the extent necessary for them to perform their work on our behalf. These providers are required to protect your
          information and use it only for the purposes we specify.
        </p>
        <p>
          We may also disclose personal information where required or permitted by law, or to protect the rights, safety,
          and property of Stratum, our clients, or others.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and analytics",
    body: (
      <>
        <p>
          Our website uses cookies and similar technologies to keep the site working, understand how it is used, and
          improve it. Analytics tools may collect aggregated, non-identifying information such as pages visited and general
          location.
        </p>
        <p>
          You can set your browser to refuse some or all cookies, or to alert you when a site sets them. Some parts of the
          website may not function properly if cookies are disabled.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "Data retention",
    body: (
      <p>
        We keep personal information only as long as necessary to fulfil the purposes for which it was collected, or as
        required by law. Where we use personal information to make a decision that directly affects you, we retain that
        information for at least one year so you have a reasonable opportunity to access it. When information is no longer
        needed, we securely delete, destroy, or anonymize it.
      </p>
    ),
  },
  {
    id: "security",
    title: "How we protect your information",
    body: (
      <p>
        We use reasonable physical, technical, and organizational safeguards appropriate to the sensitivity of the
        information. These include encryption of data at rest and in transit, access controls and password protection,
        restricted physical access to our offices, and secure shredding or deletion of records we no longer need. No method
        of transmission or storage is completely secure, but we work to protect your information against loss, theft, and
        unauthorized access, use, or disclosure.
      </p>
    ),
  },
  {
    id: "rights",
    title: "Accuracy and your rights",
    body: (
      <>
        <p>You have the right to:</p>
        <ul>
          <li>
            <strong>Access</strong> the personal information we hold about you and ask how it has been used or disclosed.
            We will respond to written requests within 30 business days; a minimal fee may apply for some requests, and we
            will tell you in advance.
          </li>
          <li>
            <strong>Correct</strong> information that is inaccurate or incomplete. Where we agree a correction is needed, we
            update our records and, where appropriate, notify any third parties who received the earlier information.
          </li>
          <li>
            <strong>Withdraw consent</strong>, subject to legal or contractual restrictions and reasonable notice.
          </li>
        </ul>
        <p>To exercise any of these rights, contact our Privacy Officer using the details below.</p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Complaints and contact",
    body: (
      <>
        <p>
          If you have a question, concern, or complaint about how we handle your personal information, please contact our
          Privacy Officer first so we can address it:
        </p>
        <ul>
          <li>
            Email:{" "}
            <a href={`mailto:${SITE.email}`} className="text-brand-light underline-offset-4 hover:underline">
              {SITE.email}
            </a>
          </li>
          <li>
            Phone:{" "}
            <a href={SITE.phoneHref} className="text-brand-light underline-offset-4 hover:underline">
              {SITE.phoneDisplay}
            </a>
          </li>
          <li>Lower Mainland, British Columbia, Canada</li>
        </ul>
        <p>
          If you are not satisfied with our response, you may contact the Office of the Information and Privacy
          Commissioner for British Columbia.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  const ld = {
    "@type": "WebPage",
    "@id": "https://www.stratumtech.ca/privacy#webpage",
    url: "https://www.stratumtech.ca/privacy",
    name: "Privacy Policy — Stratum",
    description:
      "How Stratum collects, uses, discloses, and protects personal information under BC's Personal Information Protection Act (PIPA).",
    inLanguage: "en-CA",
    isPartOf: { "@id": "https://www.stratumtech.ca/#website" },
    publisher: { "@id": "https://www.stratumtech.ca/#organization" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([
          breadcrumb([{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy" }]),
          ld,
        ])}
      />

      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
        eyebrow="Legal"
        title="Privacy Policy"
        lede="How Stratum collects, uses, discloses, and protects your personal information — in compliance with British Columbia's Personal Information Protection Act (PIPA)."
      >
        <p className="text-sm text-ink-faint">Last updated: {LAST_UPDATED}</p>
      </PageHero>

      <section className="section bg-surface">
        <div className="container grid gap-12 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-16">
          {/* Sticky table of contents */}
          <aside className="lg:sticky lg:top-28 lg:self-start" data-reveal>
            <nav aria-label="On this page" className="flex flex-col gap-3">
              <span className="font-body text-xs font-semibold uppercase tracking-wider text-ink-faint">
                On this page
              </span>
              <ol className="flex flex-col gap-2.5">
                {SECTIONS.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="flex gap-3 text-sm text-ink-dim transition-colors hover:text-ink-bright"
                    >
                      <span className="font-display text-brand-light">{String(i + 1).padStart(2, "0")}</span>
                      <span>{s.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          {/* Policy body */}
          <div className="legal-prose flex max-w-2xl flex-col gap-14">
            {SECTIONS.map((s, i) => (
              <article key={s.id} id={s.id} className="scroll-mt-28" data-reveal>
                <div className="mb-4 flex items-baseline gap-4">
                  <span className="font-display text-[0.9375rem] leading-[1.3125rem] text-brand-light">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="font-display text-[1.125rem] leading-[1.5rem] text-ink-bright md:text-[1.40625rem] md:leading-[1.6875rem]">{s.title}</h2>
                </div>
                <div className="flex flex-col gap-4 text-base font-light leading-relaxed text-ink-dim">{s.body}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        title="Questions about your data?"
        body="Reach out and our team will walk you through how we handle and protect your information."
        ctaLabel="Talk With Stratum"
        ctaHref="/contact"
      />
    </>
  );
}
