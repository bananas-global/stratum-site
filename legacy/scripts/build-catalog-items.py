#!/usr/bin/env python3
"""Generate service catalog item HTML for services/index.html"""

SERVICES = [
    {
        "title": "Managed IT Support",
        "category": "managed-it",
        "tag": "Managed IT",
        "keywords": "managed it support help desk tickets dispatch escalation remote onsite troubleshooting",
        "description": (
            "Day-to-day support through a clear ticketing, dispatch, and escalation model — "
            "so problems are tracked, prioritized, and resolved through accountable channels instead of "
            "workarounds. Fewer recurring issues and less downtime, with one dependable place to turn when "
            "staff need help, and ongoing care for the environment beyond the ticket in front of us."
        ),
    },
    {
        "title": "Network &amp; Infrastructure",
        "category": "managed-it",
        "tag": "Managed IT",
        "keywords": "network infrastructure servers firewall wifi switches documentation diagrams lifecycle",
        "description": (
            "Core systems documented and maintained to a standard — networks, servers, firewalls, Wi-Fi, "
            "and remote access configured to reduce exposure and surprise outages. An environment that is "
            "easier to support and explain, with replacement and growth planned around where the business "
            "is headed — not only the issue showing up today."
        ),
    },
    {
        "title": "Proactive Maintenance / Monitoring",
        "category": "managed-it",
        "tag": "Managed IT",
        "keywords": "proactive maintenance monitoring patching updates alerts scheduled",
        "description": (
            "Scheduled maintenance rhythms, monitoring, and alert response with clear ownership — "
            "patching and updates that catch risks early and prevent avoidable failures. Less emergency "
            "work and more confidence in day-to-day operations, without needing to follow every technical "
            "detail, with the environment looked after before you have to ask."
        ),
    },
    {
        "title": "Hardware / Procurement / Shop",
        "category": "managed-it",
        "tag": "Managed IT",
        "keywords": "hardware procurement laptops workstations devices lifecycle warranty deployment",
        "description": (
            "Standardized device selection, secure configuration before deployment, and lifecycle planning "
            "that reduces failures from unsupported or inconsistent equipment. A simpler buying and setup "
            "process for your team, with recommendations shaped by what fits the business — not what is "
            "easiest to sell."
        ),
    },
    {
        "title": "Executive Advisory / Account Management",
        "category": "managed-it",
        "tag": "Managed IT",
        "keywords": "executive advisory account management roadmap budget vCIO strategy planning",
        "description": (
            "Scattered priorities turned into a roadmap, budget, and clear next steps — including security, "
            "compliance, and lifecycle gaps surfaced before they become emergencies. Less reactive spending "
            "and aging-system surprises, with leadership getting a plain-language view of what matters, and "
            "a partner acting in your interest over time — not only when something breaks."
        ),
    },
    {
        "title": "Cybersecurity Services",
        "category": "cybersecurity",
        "tag": "Cybersecurity",
        "keywords": "cybersecurity mfa edr email security patching monitoring incident response ransomware",
        "description": (
            "A defined security framework — MFA, endpoint protection, email security, patching, monitoring, "
            "and incident response — instead of a pile of disconnected tools. Less disruption from compromise "
            "and data loss, cyber risk translated into priorities you can act on, and protection for your "
            "operations, reputation, and long-term resilience."
        ),
    },
    {
        "title": "Backup &amp; Disaster Recovery",
        "category": "cybersecurity",
        "tag": "Cybersecurity",
        "keywords": "backup disaster recovery bdr ransomware restore test recovery data protection",
        "description": (
            "Clear scope for what is backed up, how often, where it lives, and how recovery is tested — "
            "protecting against data loss, ransomware, hardware failure, and human error. A business that "
            "stays recoverable when something goes wrong, recovery plans leadership can understand, and "
            "verification so you are not assuming protection you do not actually have."
        ),
    },
    {
        "title": "Microsoft 365 / Cloud Services",
        "category": "business-systems",
        "tag": "Business Systems",
        "keywords": "microsoft 365 m365 cloud licensing email teams sharepoint collaboration identity",
        "description": (
            "Users, licensing, permissions, email, files, and collaboration organized and secured — "
            "identity, sharing, and retention under control, with reliable access to the tools staff depend "
            "on every day. Practical guidance so the platforms you already pay for are configured and used "
            "the way your business needs."
        ),
    },
    {
        "title": "ERP / CRM / AI / Automation Implementation",
        "category": "business-systems",
        "tag": "Business Systems",
        "keywords": "erp crm automation ai workflows integration business systems implementation",
        "description": (
            "Business systems, workflows, and data structured with proper access, controls, and governance "
            "from implementation onward. Less dependence on spreadsheets and tribal knowledge, processes "
            "staff and leadership can run with confidence, and modernization that builds durable value "
            "instead of adding complexity."
        ),
    },
    {
        "title": "Projects / Migrations",
        "category": "business-systems",
        "tag": "Business Systems",
        "keywords": "projects migrations server cloud infrastructure implementation rollout",
        "description": (
            "Major changes delivered with scope, documentation, and secure transitions across systems, "
            "servers, cloud, and networks — reducing disruption while the business keeps moving. A clear "
            "path through migrations and upgrades, fewer surprises along the way, and ownership from "
            "planning through handoff back to steady-state support."
        ),
    },
]

CHEVRON = (
    '<svg class="service-catalog-item__chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">'
    '<path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.5" '
    'stroke-linecap="round" stroke-linejoin="round"/></svg>'
)


def slug(title: str) -> str:
    return (
        title.replace("&amp;", "")
        .lower()
        .replace(" / ", "-")
        .replace("/", "-")
        .replace(" ", "-")
        .replace("--", "-")
    )


def render_item(s, index: int) -> str:
    panel_id = f"catalog-panel-{slug(s['title'])}"
    tag_class = f"service-catalog-item__tag--{s['category']}"
    return f"""            <article class="service-catalog-item" data-category="{s['category']}" data-keywords="{s['keywords']}">
              <div class="service-catalog-item__header">
                <div class="wf-placeholder service-catalog-item__logo" aria-hidden="true">Image</div>
                <button type="button" class="service-catalog-item__trigger" aria-expanded="false" aria-controls="{panel_id}" id="{panel_id}-trigger">
                  <div class="service-catalog-item__main">
                    <div class="service-catalog-item__title">{s['title']}</div>
                    <span class="service-catalog-item__tag {tag_class}">{s['tag']}</span>
                  </div>
                  <span class="service-catalog-item__toggle">{CHEVRON}</span>
                </button>
              </div>
              <div class="service-catalog-item__panel" id="{panel_id}" role="region" aria-labelledby="{panel_id}-trigger">
                <p>{s['description']}</p>
              </div>
            </article>"""


def render_all() -> str:
    return "\n".join(render_item(s, i) for i, s in enumerate(SERVICES))


if __name__ == "__main__":
    import re
    from pathlib import Path

    path = Path(__file__).resolve().parents[1] / "services" / "index.html"
    text = path.read_text()
    items = render_all()
    text = re.sub(
        r'(<div class="service-catalog__list" id="service-catalog-list">)\s*.*?\s*(</div>\s*<p class="service-catalog__empty")',
        lambda m: f"{m.group(1)}\n{items}\n          {m.group(2)}",
        text,
        count=1,
        flags=re.DOTALL,
    )
    path.write_text(text)
    print("Updated catalog items in", path)
