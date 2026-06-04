export type ServiceCard = { title: string; body: string; n?: string };

export type Service = {
  slug: string;
  name: string;
  eyebrow: string;
  metaTitle: string;
  metaDescription: string;
  serviceType: string;
  ldDescription: string;
  h1: string;
  lede: string;
  heroCta: string;
  whatItIs: { h2: string; body: string };
  scope: { h2: string; lede?: string; items: { label: string; sub: string }[] };
  handles: { h2: string; numbered?: boolean; cols?: 2 | 3 | 4; items: ServiceCard[] };
  backup?: {
    h2: string;
    body: string;
    items: { label: string; sub: string }[];
    note: string;
  };
  howWeWork: { h2: string; lede?: string; steps: { n: string; title: string; body: string }[] };
  whatYouGet: { h2: string; lede?: string; items: ServiceCard[] };
  proof: {
    h2: string;
    outcomes?: { value: string; label: string; sub: string }[];
    logos?: string[];
    note: string;
  };
  cta: { h2: string; body: string };
};

export const SERVICES: Service[] = [
  {
    slug: "managed-it",
    name: "Managed IT",
    eyebrow: "Service — Managed IT",
    metaTitle: "Managed IT Services for Growing Businesses",
    metaDescription:
      "Structured managed IT support for growing organizations. Help desk, device management, monitoring, patching, and vendor coordination — built for reliability.",
    serviceType: "Managed IT Services",
    ldDescription:
      "Ongoing support, maintenance, monitoring, and oversight of the systems your business depends on every day — help desk, device management, patching, backup oversight, and vendor coordination.",
    h1: "Managed IT support built for reliability, not chaos.",
    lede: "Stratum helps growing businesses keep systems stable, users supported, and daily operations moving — through structured managed IT support with clear accountability.",
    heroCta: "Review your IT environment",
    whatItIs: {
      h2: "The ongoing care of the systems your business depends on every day.",
      body: "Managed IT is the ongoing support, maintenance, monitoring, and oversight of the technology your team uses to get work done. This is not just fixing problems when they come up — it is making the environment more stable and more manageable over time, so the same issues stop coming back.",
    },
    scope: {
      h2: "Across the full operating environment.",
      lede: "Managed IT affects how the business runs day to day — not just one system, not just one team.",
      items: [
        { label: "Users", sub: "Onboarding, offboarding, daily support" },
        { label: "Workstations", sub: "Standards, configuration, lifecycle" },
        { label: "Devices", sub: "Laptops, mobile, printers, peripherals" },
        { label: "Networks", sub: "Wi-Fi, switches, routing, segmentation" },
        { label: "Shared systems", sub: "File shares, Microsoft 365, line-of-business apps" },
        { label: "Support workflows", sub: "Ticketing, dispatch, escalation, accountability" },
      ],
    },
    handles: {
      h2: "Structured responsibility — not a random list of IT tasks.",
      cols: 4,
      items: [
        { title: "Help desk & user support", body: "Responsive, plain-language support for the day-to-day technology questions and issues your team runs into." },
        { title: "Device management", body: "Workstations, laptops, and endpoints managed, monitored, and supported across their full lifecycle." },
        { title: "Monitoring & alerts", body: "Always-on monitoring so problems are caught — and often resolved — before they affect the business." },
        { title: "Patching & maintenance", body: "Scheduled updates, security patches, and routine maintenance handled on a predictable rhythm." },
        { title: "Network & infrastructure", body: "Wi-Fi, switching, segmentation, remote access, and infrastructure documentation kept stable and current." },
        { title: "Backup oversight", body: "Day-to-day oversight of backups and restore checks. Recovery-readiness strategy lives under Cybersecurity." },
        { title: "Vendor coordination", body: "We work with your software, hardware, and ISP vendors so your team does not have to chase every issue." },
        { title: "Documentation & hardware", body: "Network diagrams, runbooks, configuration notes, and hardware procurement standards kept current." },
      ],
    },
    howWeWork: {
      h2: "We do not just react to issues.",
      lede: "We work to make the environment easier to support and easier to trust over time.",
      steps: [
        { n: "01", title: "Clear accountability", body: "One partner responsible for the environment. No finger-pointing between vendors when something breaks." },
        { n: "02", title: "Structured support process", body: "Tickets, priorities, dispatch, escalation, and follow-up — so issues are handled the same way every time." },
        { n: "03", title: "Proactive oversight", body: "Monitoring, patching, and maintenance happen on schedule so reactive firefighting is the exception, not the norm." },
        { n: "04", title: "Plain-language communication", body: "Direct updates in language leadership can act on — without technical translation." },
      ],
    },
    whatYouGet: {
      h2: "A more dependable environment.",
      lede: "Managed IT is measured by how your business actually runs — not by how many tools are in the stack.",
      items: [
        { title: "Fewer recurring issues", body: "We do not just close tickets — we look at why they keep happening and remove the source." },
        { title: "Better uptime", body: "Proactive maintenance and monitoring reduce the kind of failures that interrupt the workday." },
        { title: "Less user friction", body: "People spend less time on technology problems and more time on the work the business actually pays them for." },
        { title: "Visibility into the environment", body: "You know what is being supported, what is being maintained, and what is coming up next." },
        { title: "Consistent support experience", body: "The same process every time — no guessing how an issue will be handled." },
        { title: "Confidence in your IT", body: "Leadership stops being the unofficial IT decision-maker for every problem." },
      ],
    },
    proof: {
      h2: "Built on standards and real client environments.",
      outcomes: [
        { value: "—", label: "Average response time", sub: "To be confirmed" },
        { value: "—", label: "Tickets resolved on first contact", sub: "To be confirmed" },
        { value: "—", label: "Years in operation", sub: "To be confirmed" },
      ],
      logos: ["Microsoft", "SentinelOne", "N-able", "IT Glue", "Cove"],
      note: "Content gap: confirm proof stats and partner badges before launch.",
    },
    cta: {
      h2: "If your IT support feels reactive, inconsistent, or difficult to trust — let's talk.",
      body: "A straightforward conversation about what a more structured environment could look like for your business.",
    },
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    eyebrow: "Service — Cybersecurity",
    metaTitle: "Cybersecurity Services for Growing Businesses",
    metaDescription:
      "Practical cybersecurity for growing organizations. Layered protection, endpoint security, backup readiness, access control, and incident response — no fear language, no hype.",
    serviceType: "Cybersecurity Services",
    ldDescription:
      "Layered protection, recovery readiness, and clearer control across users, endpoints, backups, and access — practical risk reduction for growing businesses.",
    h1: "Practical cybersecurity for businesses that cannot afford unnecessary risk.",
    lede: "Stratum helps growing organizations reduce risk through layered protection, stronger recovery readiness, and clearer control across the environment — without hype and without fear language.",
    heroCta: "Review your risk exposure",
    whatItIs: {
      h2: "Cybersecurity is part of how the business protects its operations.",
      body: "The set of protections, controls, and response capabilities that reduce business risk across users, systems, access, and data. This is not just software — it is the combination of standards, tools, and accountability that keeps the business operating safely when something goes wrong. We translate cyber risk into plain-language priorities so leadership can make decisions without needing to become security experts.",
    },
    scope: {
      h2: "Risk exists across the whole operating environment.",
      lede: "Security is not just an IT layer — it touches users, devices, data, vendors, customers, and compliance.",
      items: [
        { label: "Users & access", sub: "Identity, MFA, password practices, and permission control." },
        { label: "Endpoints & devices", sub: "Laptops, workstations, and mobile devices used to access company systems." },
        { label: "Backups & recovery", sub: "The ability to actually restore operations after an incident." },
        { label: "Monitoring & response", sub: "Visibility into what is happening and structure to respond when something is wrong." },
        { label: "Policies & accountability", sub: "Defined ownership for who handles what, and how." },
        { label: "Compliance expectations", sub: "Meeting the security bar your clients, partners, and insurers already expect." },
      ],
    },
    handles: {
      h2: "Layered protection — not a single product sold as a silver bullet.",
      numbered: true,
      items: [
        { n: "01", title: "Endpoint protection", body: "Modern EDR and antivirus across all workstations, servers, and devices that touch the business." },
        { n: "02", title: "Identity & access control", body: "MFA, role-based access, and review of who has access to what — including former employees and vendors." },
        { n: "03", title: "Email security", body: "Filtering, phishing protection, and user awareness so the most common attack vector is the most monitored." },
        { n: "04", title: "Backup & recovery readiness", body: "Backups that are verified, tested, and protected — so recovery is real, not theoretical." },
        { n: "05", title: "Monitoring & response", body: "Always-on monitoring with structured response when something looks wrong." },
        { n: "06", title: "Policy & compliance support", body: "Plain-language support for cyber-insurance, customer security questionnaires, and regulatory baselines." },
      ],
    },
    backup: {
      h2: "Backup is a security outcome, not a storage product.",
      body: "The point of backup is not having backups — it is being able to recover. Most businesses we meet have backups configured. Fewer have actually tested whether they can restore the systems that the business depends on. We treat backup as part of the security posture: defined scope, verified runs, tested restores, immutable copies where it matters, and documented recovery steps that someone other than IT can execute under pressure.",
      items: [
        { label: "Defined scope", sub: "What is backed up, how often, where, and how long it is retained." },
        { label: "Verified runs", sub: "Automated checks on every backup, with a human reviewing what fails." },
        { label: "Tested restores", sub: "Actual restore tests on a real schedule — not a 'we should do that' item on a roadmap." },
        { label: "Immutable & offsite copies", sub: "Where the business risk justifies it — ransomware-aware by design." },
        { label: "Documented recovery", sub: "Plain-language steps so recovery does not depend on one person being available." },
        { label: "Insurance & compliance alignment", sub: "Backup posture mapped to what your insurer and customers actually expect." },
      ],
      note: "How this connects: Managed IT clients receive day-to-day backup oversight as part of their engagement. Cybersecurity adds recovery-readiness strategy, testing, and incident integration on top of that.",
    },
    howWeWork: {
      h2: "Visibility, layered controls, and structured follow-through.",
      lede: "We help reduce exposure while keeping the environment understandable and manageable for the people responsible for the business.",
      steps: [
        { n: "01", title: "Understand the exposure", body: "Review users, endpoints, data, vendors, backups, and access. Identify what would actually disrupt the business if compromised." },
        { n: "02", title: "Layer the protection", body: "Endpoint, identity, email, backup, and monitoring controls implemented in the right order — not all at once, not as one tool." },
        { n: "03", title: "Practice readiness", body: "Backups tested. Recovery steps documented. Response process agreed before an incident — not during one." },
        { n: "04", title: "Review and refine", body: "Quarterly reviews so the security posture keeps up as the business, users, and threats change." },
      ],
    },
    whatYouGet: {
      h2: "Less exposure. More confidence.",
      lede: "Cybersecurity that actually changes how the business operates and responds — not just a list of tools.",
      items: [
        { title: "Reduced exposure", body: "The most common, most damaging attack paths are covered — and visible." },
        { title: "Stronger recovery readiness", body: "You know what is protected, how it is restored, and how long it takes." },
        { title: "Clearer accountability", body: "Defined ownership for who handles what when something happens." },
        { title: "Compliance & insurance support", body: "You can answer security questionnaires and meet insurance baselines without scrambling." },
        { title: "Less operational uncertainty", body: "Security decisions become routine — not crises." },
        { title: "Confidence in your controls", body: "Leadership can speak to the security posture without needing a technical translator." },
      ],
    },
    proof: {
      h2: "Built on industry-standard tools and partner programs.",
      logos: ["Microsoft", "SentinelOne", "KnowBe4", "Cove", "N-able"],
      note: "Content gap: confirm partner badges and add 1–2 short reassurance statements from clients before launch.",
    },
    cta: {
      h2: "If you need a clearer view of your risk and a more practical way to strengthen security — let's start there.",
      body: "No fear language. A direct conversation about what protection actually looks like for your business.",
    },
  },
  {
    slug: "business-systems",
    name: "Business Systems",
    eyebrow: "Service — Business Systems",
    metaTitle: "Business Systems — ERP, CRM & Automation",
    metaDescription:
      "ERP, CRM, automation, and AI enablement aligned with how your business actually operates. Discovery-first, process-fit, practical implementation for growing organizations.",
    serviceType: "Business Systems Implementation",
    ldDescription:
      "ERP, CRM, automation, and AI enablement aligned with how your business actually operates. Discovery-first, process-fit, practical implementation.",
    h1: "Business systems that support growth, clarity, and execution.",
    lede: "Stratum helps growing businesses improve core systems — ERP, CRM, automation, and AI — so technology supports operations instead of creating more friction.",
    heroCta: "Talk about a systems project",
    whatItIs: {
      h2: "The technology layer that supports how your company actually operates.",
      body: "Business Systems supports workflows, system fit, information flow, and the tools behind execution — not just software setup. It is making sure the systems you depend on fit the way your business runs, including the handoffs and reporting that determine whether new tools become useful or become workarounds. We lead with discovery: current-state first, process fit second, technology choice third.",
    },
    scope: {
      h2: "Across the parts of the business that depend on systems working together.",
      items: [
        { label: "Sales & customer management", sub: "Pipeline, customer records, and communication history." },
        { label: "Operations", sub: "Fulfilment, scheduling, dispatch, and project execution." },
        { label: "Internal workflows", sub: "Approvals, handoffs, and recurring processes." },
        { label: "Reporting", sub: "Leadership visibility into what is actually happening." },
        { label: "Data movement", sub: "Between systems, between teams, between sites." },
        { label: "Cross-team handoffs", sub: "Sales to operations, operations to finance, support to account management." },
      ],
    },
    handles: {
      h2: "Practical capability — not trendy buzzwords.",
      items: [
        { title: "ERP support & implementation", body: "Selection, setup, and rollout support for ERP systems that match how the business actually operates." },
        { title: "CRM support & implementation", body: "Customer relationship platforms configured around your sales process — not the platform's defaults." },
        { title: "Automation", body: "Workflow automation that removes manual handoffs, double entry, and process bottlenecks." },
        { title: "AI enablement", body: "Practical AI use cases applied to real workflows, with clear scope and clear governance." },
        { title: "Integrations", body: "Connections between systems so data moves where it needs to without manual rekeying." },
        { title: "Microsoft ecosystem", body: "Microsoft 365, SharePoint, Teams, and Power Platform aligned to how your team actually collaborates." },
      ],
    },
    howWeWork: {
      h2: "Discovery first. Implementation second.",
      lede: "We start by understanding how the business runs now, where the friction is, and what needs to improve — before we recommend any change.",
      steps: [
        { n: "01", title: "Discovery", body: "Map the current process, the systems involved, the data, the people, and the friction points." },
        { n: "02", title: "Process fit", body: "Determine what should change in the process, what should change in the system, and what should not change at all." },
        { n: "03", title: "Implementation", body: "Plan, configure, and roll out with clear ownership, communication, and a defined cutover." },
        { n: "04", title: "Refinement", body: "Adjust over time as users adopt the system and as the business changes." },
      ],
    },
    whatYouGet: {
      h2: "Systems that support how the business actually runs.",
      items: [
        { title: "Better visibility", body: "Leadership gets information out of systems, not just into them." },
        { title: "Cleaner workflows", body: "Fewer manual handoffs, fewer workarounds, fewer 'the system doesn't do that' moments." },
        { title: "More consistent execution", body: "The same process runs the same way, regardless of who is on shift." },
        { title: "Stronger reporting", body: "Data that actually answers leadership questions instead of generating more questions." },
        { title: "Easier scale", body: "Adding people, sites, or volume does not require rebuilding the operating model." },
        { title: "Systems that support growth", body: "The technology stops being something the team works around and starts being something the team works with." },
      ],
    },
    proof: {
      h2: "Real implementations across real operating environments.",
      outcomes: [
        { value: "—", label: "Systems implemented", sub: "To be confirmed" },
        { value: "—", label: "Average implementation timeline", sub: "To be confirmed" },
        { value: "—", label: "Manual hours removed per year", sub: "To be confirmed" },
      ],
      note: "Content gap: add 2–3 short use-case snapshots from real projects.",
    },
    cta: {
      h2: "If your systems are creating friction instead of supporting the business — let's look at where the structure needs to improve.",
      body: "A direct conversation about what the right system fit looks like for your operation.",
    },
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);
