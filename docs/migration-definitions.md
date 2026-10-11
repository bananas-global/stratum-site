# Stratum ownership migration

Status: awaiting Austin and Jeremy's decisions. No migration authorized or executed by this document.

This records the email Bruno confirmed he sent in response to Austin's September 14, 2026 email, **“Transferring website ownership to Stratum — GitHub repo & Vercel.”** The outgoing text below is the reference for what was proposed; proposals are not yet accepted decisions. Formatting has been normalized, but the wording is preserved.

## Email sent

Hi Austin, hi Jeremy,

Absolutely. Moving the website into Stratum-owned accounts makes sense.

Jeremy, please create the Stratum GitHub organization and Vercel team with company-owned billing, and send me their names and the appropriate invitations. We should be able to transfer the existing repository and Vercel project, preserving the deployment setup.

There are a few related services and decisions to cover:

- **Internal tools:** the email-signature and ID-badge generators currently use email-based sign-in, with Resend delivering the login links. To keep this working, you’ll need your own email-sending setup, including a verified sender, and we’ll update the API key and sender settings in Vercel. Using your own Resend account would require the fewest changes; another provider or authentication method would require adapting the implementation.

- **Content publishing**: I originally connected the blog to Notion so Nathan or someone in marketing could publish articles without Git access. That Notion database belongs to my account. Since your team is technically comfortable, I suggest making the website repository the source of truth for all articles, completing the migration of the existing content and removing the Notion dependency. Your team could then use coding agents to write and update articles through the repository, without needing a separate Notion setup. Please confirm whether this workflow works for you.

- **Knowledge base:** this currently runs on my infrastructure. If you’d like to bring it across too, we can migrate its content into the website and protect it using whichever access-control approach you choose for the internal tools. The content would remain available; the feature that would not carry over is VectorSpace’s natural-language assistant, which answers questions using the knowledge base.

For the existing website transfer, I’d provisionally allow 1–2 working days once the accounts and access are ready. Once we agree on authentication, the publishing workflow and whether to include the knowledge base.

Ow, also... it'd be super handy to be able to DM you guys. I have Telegram, Whatsapp, Slack, Buzz... it's just my email that has a billion messages and yours will get lost in there sometimes

WhatsApp: https://wa.me/5515991185772

Telegram: https://t.me/brucera_coronation

Thanks,
Bruno

## Decisions and inputs pending

| Topic | Proposal / requested input | Status |
| --- | --- | --- |
| GitHub | Jeremy creates the Stratum organization and provides its name and invitation. Transfer `bananas-global/stratum-site`; retain Bruno's agreed collaborator access. | Awaiting details |
| Vercel | Jeremy creates the Stratum team with company billing and provides its name and invitation. Transfer the existing `vectorspace/stratum-site` project. | Awaiting details |
| Staff authentication | Use Stratum-owned Resend credentials and a verified sender, or specify a different email provider/authentication method. | Awaiting decision |
| Publishing | Make the repository the source of truth for articles and remove the dependency on Bruno's Notion database; use agents and Git for future updates. | Awaiting acceptance |
| Knowledge base | Optionally migrate content from Bruno's infrastructure into the website, under the agreed staff access control. VectorSpace's RAG assistant is excluded. | Awaiting scope decision |
| Coordination | Choose a direct messaging channel. | Awaiting preference |
| Timing | Provisional 1–2 working days for the existing website transfer after accounts and access are ready. Confirm the complete schedule after scope decisions. | Provisional, not a commitment for additional implementation |

## How to proceed when they reply

1. Record their response and date below. Update each pending item with the actual decision, keeping unresolved items explicit.
2. Verify the destination organization/team, invitations, billing and agreed ongoing access. Confirm the migration scope and schedule with Bruno before executing transfers.
3. Prepare the accepted changes and test them before retiring existing dependencies. Preserve the current production deployment and document a recovery path for the cutover.
4. Transfer the repository and Vercel project in a coordinated window; verify Git integration, environment configuration, domains, redirects and deployments afterward. Do not assume third-party accounts transfer with Vercel.
5. Verify the public site, contact form, staff sign-in, signature and badge tools, article publishing, and knowledge-base access if included. Retire old dependencies only after the replacement is verified.

### Technical handover notes

These are implementation reminders from the repository assessment, not additional client-approved scope. Recheck live configuration before execution.

- **Authentication:** `lib/internal-auth.ts`, `middleware.ts`, and `app/internal/sign-in/actions.ts`. Resend uses `RESEND_API_KEY` and `CONTACT_FROM_EMAIL`; access depends on `INTERNAL_AUTH_SECRET` and `INTERNAL_ALLOWED_EMAILS`. Replacing the email provider requires code changes. Rotating the signing secret signs users out. Never record secret values here.
- **Publishing:** `scripts/notion-sync.mjs` runs before development and production builds. Existing articles and downloaded images are already stored in `content/insights/` and `public/insights/`; reconcile them against the final Notion content before disconnecting. The same script also updates `content/signature-cta.json`, so removing Notion must account for the signature CTA as well as articles. Relevant variables: `NOTION_TOKEN`, `NOTION_DATA_SOURCE_ID`, and optional `NOTION_CTA_DATA_SOURCE_ID`.
- **Knowledge base:** the dashboard links to a separate deployment through `KNOWLEDGE_BASE` in `lib/site.ts`. Inventory its content and assets separately if migration is accepted. Do not commit private knowledge-base content into a public repository; determine suitable repository visibility/storage before importing it. Page authentication does not hide public Git source or static files in `public/`.
- **GitHub visibility:** the repository was public during the assessment. Confirm visibility before any private content is added.
- **Other continuity checks:** the public contact form uses HubSpot; the old `/api/contact` endpoint uses Resend. Preserve contact delivery, analytics configuration, canonical URLs and legacy redirects during the handover. These were not presented as new decisions in the sent email.

## Response and decision log

No client response recorded yet. Add dated entries here with decisions, outstanding questions, scope changes and the agreed next action.
