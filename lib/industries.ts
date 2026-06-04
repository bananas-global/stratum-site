export type Industry = {
  slug: string;
  name: string; // breadcrumb / short
  eyebrow: string;
  metaTitle: string;
  metaDescription: string;
  serviceType: string;
  audienceType: string;
  ldName: string;
  ldDescription: string;
  h1: string;
  lede: string;
  tags: string[];
  understand: { h2: string; body: string };
  complexity: { h2: string; items: { label: string; sub: string }[] };
  delivers: { h2: string; items: { title: string; body: string }[] };
  steps: { n: string; title: string; body: string }[];
  outcomes: { h2: string; items: { title: string; body: string }[] };
  proofH2: string;
  cta: { h2: string; body: string };
};

const STEPS_STD = (understandTitle: string, understandBody: string, scopeBody: string): Industry["steps"] => [
  { n: "01", title: understandTitle, body: understandBody },
  { n: "02", title: "Define the scope", body: scopeBody },
  { n: "03", title: "Deliver structured support", body: "Clear accountability, structured process, proactive oversight, plain-language updates." },
  { n: "04", title: "Stay as a long-term partner", body: "Lifecycle planning, roadmap reviews, and account management that looks ahead." },
];

export const INDUSTRIES: Industry[] = [
  {
    slug: "automotive-dealerships",
    name: "Automotive Dealerships",
    eyebrow: "Industry — Automotive Dealerships",
    metaTitle: "IT Support for Automotive Dealerships",
    metaDescription:
      "Managed IT and cybersecurity for automotive dealerships for growing organizations. Sales, service, parts, finance, and back office — all kept connected, supported, and secure.",
    serviceType: "Managed IT Services for Automotive Dealerships",
    audienceType: "Automotive Dealerships",
    ldName: "Stratum — IT for Automotive Dealerships",
    ldDescription:
      "Managed IT, cybersecurity, network, and vendor coordination for automotive dealerships — sales floors, service bays, finance, and back-office systems supported as one operation.",
    h1: "IT support for automotive dealerships that runs at dealership speed.",
    lede: "Sales floors, service bays, finance offices, and back-office systems all depend on reliable technology running together. Stratum keeps every part of the dealership connected, supported, and secure.",
    tags: ["Managed IT", "Network & Infrastructure", "Cybersecurity", "Vendor & DMS Coordination", "Proactive Maintenance"],
    understand: {
      h2: "Dealerships run on uptime.",
      body: "A dealership is not one operation — it is several running in parallel. Sales, service, parts, finance, and management each depend on different systems and different vendors, but the customer experiences it as one. IT problems on the floor, in the service lane, or in the finance office cost real revenue every hour they go unresolved. We are built to handle that complexity calmly.",
    },
    complexity: {
      h2: "The operational realities we plan for.",
      items: [
        { label: "Multi-department complexity", sub: "Sales, service, parts, finance, and management all need reliable systems running together." },
        { label: "DMS & vendor coordination", sub: "OEM portals and software vendors that don't always talk to each other — we coordinate so your team doesn't have to." },
        { label: "Network stability", sub: "Showrooms, service lanes, and Wi-Fi for staff and guests, kept stable across the property." },
        { label: "Printer & peripheral sprawl", sub: "Managed, standardized, and supported so they stop being a daily source of friction." },
        { label: "Customer & financial data", sub: "Security and access controls that meet what your customers and OEMs already expect." },
      ],
    },
    delivers: {
      h2: "One partner across the whole dealership.",
      items: [
        { title: "Structured managed IT", body: "Help desk, device management, patching, and monitoring across every department on every site." },
        { title: "Network & Wi-Fi", body: "Reliable, segmented network across showroom, service, parts, and guest Wi-Fi." },
        { title: "Cybersecurity layer", body: "Endpoint protection, identity, email, and backup readiness — meeting OEM and insurance expectations." },
        { title: "Vendor coordination", body: "We manage the back-and-forth with DMS, OEM, ISP, and software vendors so your team can focus on customers." },
        { title: "Proactive maintenance", body: "Scheduled work that prevents downtime during high-traffic hours — not during them." },
        { title: "Lifecycle planning", body: "Workstations, printers, and infrastructure planned ahead — not replaced in emergencies." },
      ],
    },
    steps: STEPS_STD(
      "Understand the operation",
      "Review systems, vendors, support history, and operational rhythm before recommending anything.",
      "Size the engagement around endpoints, sites, network complexity, and risk — not just headcount."
    ),
    outcomes: {
      h2: "What changes when Stratum is in the seat.",
      items: [
        { title: "Less downtime in customer-facing hours", body: "Maintenance and changes happen on a schedule that respects the dealership's day." },
        { title: "One support number", body: "The team knows where to call. We coordinate everything behind it." },
        { title: "Quiet vendor management", body: "Issues with DMS, OEM portals, and software vendors get worked without management having to chase them." },
        { title: "Security posture leadership can speak to", body: "OEM, insurance, and customer security questions have clear answers." },
      ],
    },
    proofH2: "Stratum already works in this segment.",
    cta: {
      h2: "If your dealership's IT feels reactive or vendor-fragmented — let's talk.",
      body: "A direct conversation about what one structured technology partner could look like across your operation.",
    },
  },
  {
    slug: "construction-aec",
    name: "Construction & AEC",
    eyebrow: "Industry — Construction & AEC",
    metaTitle: "IT Support for Construction & AEC Firms",
    metaDescription:
      "Managed IT, cybersecurity, and field-aware support for construction and AEC firms for growing organizations. Office, job site, and field crew technology covered as one operation.",
    serviceType: "Managed IT for Construction and AEC",
    audienceType: "Construction and AEC Firms",
    ldName: "Stratum — IT for Construction & AEC",
    ldDescription:
      "Managed IT, network, mobile/field support, and business systems for construction and architecture/engineering firms for growing organizations.",
    h1: "IT support that works in the office, on the site, and in the field.",
    lede: "Construction businesses run across offices, job sites, and field crews simultaneously. Technology has to work everywhere — and keep up as teams scale, projects shift, and subcontractors come and go.",
    tags: ["Managed IT", "Network & Infrastructure", "Business Systems", "Mobile & Field Support", "Vendor Coordination"],
    understand: {
      h2: "Construction does not run from a single desk.",
      body: "Estimators, project managers, field crews, and back office are all using technology in different places, on different schedules, with different connectivity. Subcontractors come on and off projects. Devices move between sites. Vendors and tools change. Standard, structured support is what holds it together.",
    },
    complexity: {
      h2: "The operational realities we plan for.",
      items: [
        { label: "Office & field support", sub: "Mobile devices, site connectivity, and back-office systems covered together." },
        { label: "Onboarding & offboarding", sub: "Structured for crews, subcontractors, and rotating roles." },
        { label: "Project data security", sub: "Access managed cleanly across roles, sites, and partners." },
        { label: "Vendor & software coordination", sub: "Estimating, project management, and accounting tools coordinated so teams don't have to." },
        { label: "Proactive site management", sub: "Complexity handled before a deadline is at risk — not during." },
      ],
    },
    delivers: {
      h2: "One partner across office, site, and field.",
      items: [
        { title: "Managed IT", body: "Help desk, devices, and support standards that work for both office staff and field crews." },
        { title: "Mobile & field readiness", body: "Mobile device management, connectivity, and structured support for devices that move between sites." },
        { title: "Network & infrastructure", body: "Office networks, site connectivity, and remote-access security across the operation." },
        { title: "Business systems", body: "Support for estimating, project management, and accounting platforms — ERP and CRM where appropriate." },
        { title: "Cybersecurity layer", body: "Endpoint, identity, email, and backup readiness for an environment with high turnover." },
        { title: "Onboarding/offboarding", body: "Fast, structured access changes for crews, subs, and rotating roles." },
      ],
    },
    steps: STEPS_STD(
      "Understand the operation",
      "Map office, sites, field crews, devices, and key software before any change.",
      "Sized around endpoints, sites, mobile devices, network complexity, and security — not just headcount."
    ),
    outcomes: {
      h2: "What changes when Stratum is in place.",
      items: [
        { title: "Office, site, and field on the same page", body: "Support standards and security apply consistently across the whole operation." },
        { title: "Smooth crew transitions", body: "Onboarding and offboarding happen on schedule — not in a panic before a project starts." },
        { title: "Less vendor wrangling", body: "We handle the back-and-forth so project managers can focus on projects." },
        { title: "Project data protected", body: "Access controls keep sensitive plans, contracts, and records on a need-to-know basis." },
      ],
    },
    proofH2: "Built for operations that don't stand still.",
    cta: {
      h2: "If your office, sites, and field crews aren't on the same technology footing — let's talk.",
      body: "A direct conversation about what one structured partner could do across the whole operation.",
    },
  },
  {
    slug: "law-firms",
    name: "Law Firms",
    eyebrow: "Industry — Law Firms",
    metaTitle: "IT Support for Law Firms & Legal Services",
    metaDescription:
      "Managed IT and cybersecurity for law firms for growing organizations. Document security, email protection, backup readiness, and accountability for legal teams that run on trust.",
    serviceType: "Managed IT for Legal Services",
    audienceType: "Law Firms and Legal Services",
    ldName: "Stratum — IT for Law Firms",
    ldDescription: "Managed IT, cybersecurity, document security, and backup readiness for law firms for growing organizations.",
    h1: "IT support for law firms that run on trust, documents, and continuity.",
    lede: "A single incident — lost files, a compromised account, or hours of downtime — can have serious professional consequences. We protect the environment that protects your clients.",
    tags: ["Managed IT", "Cybersecurity", "Email Security", "Backup & Recovery", "Microsoft 365"],
    understand: {
      h2: "Law firms operate on trust, document access, and continuity.",
      body: "Billable time is lost when the system is unavailable. Client trust is lost when communication or files are compromised. Professional standing is on the line when continuity fails. We work with firms that hold themselves to high standards — and need an IT partner that meets those same standards.",
    },
    complexity: {
      h2: "The operational realities we plan for.",
      items: [
        { label: "Document & file security", sub: "Built around how legal teams actually work — matters, versions, conflicts." },
        { label: "Email security", sub: "Access controls to protect sensitive client communications from compromise." },
        { label: "Backup readiness", sub: "Matter files and records are never truly at risk." },
        { label: "Clear accountability", sub: "Direct communication — the same standards you hold yourself to." },
        { label: "Technology stewardship", sub: "Aligned with the long-term needs of the firm." },
      ],
    },
    delivers: {
      h2: "Quiet, structured technology behind a firm that runs on trust.",
      items: [
        { title: "Managed IT", body: "Help desk, device management, and support standards aligned with billable-hour realities." },
        { title: "Email & identity security", body: "Layered protection against the compromise that most often hits professional services firms." },
        { title: "Document & matter security", body: "Access controls that match how legal teams structure work — including external counsel and contractors." },
        { title: "Backup & recovery", body: "Tested recovery for the documents and records the firm depends on." },
        { title: "Microsoft 365 done properly", body: "Mail, calendar, files, and Teams configured to support how legal teams actually collaborate." },
        { title: "Cyber-insurance support", body: "Plain-language answers to security questionnaires and compliance asks." },
      ],
    },
    steps: STEPS_STD(
      "Understand the firm",
      "Practice areas, document workflows, support history, and risk posture reviewed before recommendations.",
      "Sized around endpoints, document volume, backup needs, and risk — not just user count."
    ),
    outcomes: {
      h2: "What changes when Stratum is in place.",
      items: [
        { title: "Less billable time lost to IT", body: "Outages, slowdowns, and reactive support stop being a recurring tax on the day." },
        { title: "Documents you can trust", body: "Clear answers on access, versioning, retention, and protection." },
        { title: "Recoverability you can speak to", body: "Backups are tested, not assumed." },
        { title: "Insurance and compliance clarity", body: "Security questions get clear, accurate answers without internal scrambling." },
      ],
    },
    proofH2: "Built on the standards a professional services firm already expects.",
    cta: {
      h2: "If your firm's IT feels unpredictable — or your security posture is unclear — let's talk.",
      body: "A direct conversation about what a more dependable technology partner could look like for the firm.",
    },
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    eyebrow: "Industry — Manufacturing",
    metaTitle: "IT Support for Manufacturing & Industrial Operations",
    metaDescription:
      "Structured managed IT, network, and cybersecurity for manufacturing and industrial operations for growing organizations. Workstations, servers, OT-aware security, and multi-site stability.",
    serviceType: "Managed IT for Manufacturing",
    audienceType: "Manufacturing and Industrial Operations",
    ldName: "Stratum — IT for Manufacturing & Industrial Operations",
    ldDescription: "Structured managed IT, network, cybersecurity, and lifecycle planning for manufacturing and industrial operations for growing organizations.",
    h1: "IT support for manufacturing built on structure and uptime.",
    lede: "High device counts, multiple sites, operational systems, and uptime pressure across the floor and the back office. Structure and stability are not optional — they are built into every engagement.",
    tags: ["Managed IT", "Network & Infrastructure", "Cybersecurity", "Multi-Site Support", "Lifecycle Planning"],
    understand: {
      h2: "Production cannot wait for IT to catch up.",
      body: "Manufacturing environments combine office workstations, production-floor systems, networked equipment, and supplier-facing software — often across multiple sites. That mix needs structure: standards, documentation, lifecycle planning, and a partner comfortable working across both IT and operational technology.",
    },
    complexity: {
      h2: "The operational realities we plan for.",
      items: [
        { label: "Structured support", sub: "Workstations, servers, and operational systems at every site." },
        { label: "Network segmentation & stability", sub: "Production stays running; risk is isolated from the floor." },
        { label: "Security & monitoring", sub: "Accounts for operational technology environments — not just office IT." },
        { label: "Device lifecycle management", sub: "Standards-based planning so replacement is never a surprise." },
        { label: "Long-term stewardship", sub: "Aligned with how the operation is growing and changing." },
      ],
    },
    delivers: {
      h2: "One partner for an environment that runs across sites and shifts.",
      items: [
        { title: "Managed IT", body: "Help desk, device management, and standardized support across every site and shift." },
        { title: "Network & infrastructure", body: "Segmented, documented network design that isolates production from office and guest traffic." },
        { title: "Cybersecurity layer", body: "Endpoint, identity, email, and OT-aware controls that protect production without slowing it down." },
        { title: "Backup & recovery", body: "Recoverability for the systems that production and reporting actually depend on." },
        { title: "Multi-site support", body: "Consistent standards across sites, with awareness of local realities." },
        { title: "Lifecycle planning", body: "Standards-based device, server, and infrastructure planning — not last-minute replacements." },
      ],
    },
    steps: STEPS_STD(
      "Understand the environment",
      "Sites, devices, networks, operational systems, and risk posture reviewed before any change.",
      "Sized around endpoints, servers, sites, network complexity, and security needs."
    ),
    outcomes: {
      h2: "What changes when Stratum is in place.",
      items: [
        { title: "Production stays predictable", body: "Network and infrastructure issues stop being a recurring source of downtime." },
        { title: "One standard across sites", body: "The same support standards and security posture apply consistently." },
        { title: "Lifecycle without surprises", body: "Replacement and upgrade planning is in the operating budget, not the emergency budget." },
        { title: "Security leadership can speak to", body: "Customer, insurance, and audit security questions have clear answers." },
      ],
    },
    proofH2: "Built for environments where standards matter.",
    cta: {
      h2: "If your operation needs IT with structure across sites, devices, and shifts — let's talk.",
      body: "A direct conversation about what a structured technology partner could look like for your operation.",
    },
  },
  {
    slug: "medical-dental",
    name: "Medical & Dental",
    eyebrow: "Industry — Medical & Dental",
    metaTitle: "IT Support for Medical & Dental Clinics",
    metaDescription:
      "Managed IT, cybersecurity, and backup readiness for medical and dental clinics for growing organizations. Protect patient data, keep booking and clinical systems running, meet compliance with confidence.",
    serviceType: "Managed IT for Medical and Dental Clinics",
    audienceType: "Medical and Dental Clinics",
    ldName: "Stratum — IT for Medical & Dental Clinics",
    ldDescription: "Reliable managed IT, cybersecurity, backup, and compliance support for medical and dental clinics for growing organizations.",
    h1: "Dependable IT support for clinics that cannot afford downtime.",
    lede: "Patient data, booking systems, and compliance requirements demand a technology partner who takes responsibility seriously and acts before problems happen.",
    tags: ["Managed IT", "Cybersecurity", "Backup & Recovery", "Compliance Readiness", "Microsoft 365"],
    understand: {
      h2: "Clinics cannot afford downtime or security gaps.",
      body: "When booking, billing, charting, or imaging systems are down, patient care slows down with them. And when security is unclear, it becomes a leadership concern rather than an operational one. We work with clinics that take patient trust seriously — and need an IT partner who treats it the same way.",
    },
    complexity: {
      h2: "The operational realities we plan for.",
      items: [
        { label: "Uptime reliability", sub: "Booking, billing, and clinical systems patients depend on every day." },
        { label: "Patient data security", sub: "Access controls that match the sensitivity of the information." },
        { label: "Backup & recovery readiness", sub: "So the clinic stays operational if something goes wrong." },
        { label: "Compliance & insurance support", sub: "Plain language — no legal-speak, no scare tactics." },
        { label: "Dependable day-to-day support", sub: "Clear accountability and a direct line when something breaks." },
      ],
    },
    delivers: {
      h2: "One technology partner for the whole clinic.",
      items: [
        { title: "Managed IT", body: "Help desk, device management, monitoring, and patching — kept off your front desk's plate." },
        { title: "Cybersecurity layer", body: "Endpoint, identity, email, and access controls protecting patient and clinic data." },
        { title: "Backup & recovery", body: "Verified backups and tested recovery so a single incident doesn't shut the clinic down." },
        { title: "Microsoft 365 done right", body: "Email, calendar, and file collaboration configured properly — not just turned on." },
        { title: "Compliance readiness", body: "Plain-language support for cyber-insurance questionnaires and regulator baselines." },
        { title: "Clinic-aware support", body: "Maintenance windows that respect clinic hours and patient appointments." },
      ],
    },
    steps: STEPS_STD(
      "Understand the clinic",
      "Systems, workflows, sensitive data, and compliance posture reviewed before any change.",
      "Sized around endpoints, sites, backup needs, and risk — not just user count."
    ),
    outcomes: {
      h2: "What changes when Stratum is on the line.",
      items: [
        { title: "Fewer interrupted appointments", body: "Systems and devices are maintained before they cause front-desk issues." },
        { title: "Patient data you can speak to", body: "Clear answers about who has access, where data lives, and how it is protected." },
        { title: "Recoverability you can trust", body: "Tested backups mean a single failure doesn't shut down the clinic." },
        { title: "Insurance and compliance clarity", body: "You can answer security questionnaires without scrambling." },
      ],
    },
    proofH2: "Built on standards and partner programs that protect clinics.",
    cta: {
      h2: "If your clinic's IT feels unreliable — or your security posture is unclear — let's talk.",
      body: "A direct conversation about what a more dependable technology partner could look like for the clinic.",
    },
  },
];

export const getIndustry = (slug: string) => INDUSTRIES.find((i) => i.slug === slug);
