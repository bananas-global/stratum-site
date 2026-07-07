import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/sections";
import CTABand from "@/components/CTABand";
import { jsonLd } from "@/lib/site";
import { pageMeta, breadcrumb } from "@/lib/seo";
import { getAllPosts, formatPostDate, type PostMeta } from "@/lib/insights";

export const metadata: Metadata = pageMeta({
  title: "Insights & Resources — IT for Business Leaders",
  description:
    "Practical, plain-language insights on managed IT, cybersecurity, and business systems for business leaders for growing organizations.",
  path: "/insights",
  ogTitle: "Insights & Resources — IT for Business Leaders | Stratum",
  ogDescription: "Practical insights on managed IT, cybersecurity, and business systems for business leaders.",
});

function PostCard({ post, featured }: { post: PostMeta; featured?: boolean }) {
  return (
    <a
      href={`/insights/${post.slug}`}
      data-reveal
      className={`card group flex flex-col gap-4 hover:-translate-y-1 ${featured ? "md:col-span-2 md:flex-row md:gap-8" : ""}`}
    >
      {post.cover ? (
        // Decorative inside the card link — the post title right below is the
        // accessible name, so the cover is explicitly hidden from AT.
        <div aria-hidden="true" className={`relative overflow-hidden rounded-md border border-line-soft bg-black ${featured ? "aspect-[16/9] md:w-1/2" : "aspect-[16/9]"}`}>
          <Image
            src={post.cover.src}
            alt=""
            fill
            sizes={featured ? "(min-width: 768px) 45vw, 90vw" : "(min-width: 768px) 45vw, 90vw"}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}
      <div className={`flex flex-col gap-3 ${featured && post.cover ? "md:w-1/2 md:justify-center" : ""}`}>
        <div className="flex items-center gap-3 text-xs uppercase tracking-wider">
          <span className="text-brand-light">Insight</span>
          <span className="text-ink-faint">{formatPostDate(post.date)}</span>
        </div>
        <h3 className={`font-display text-ink-bright ${featured ? "text-[1.40625rem] leading-[1.6875rem]" : "text-[1.125rem] leading-[1.5rem]"}`}>{post.title}</h3>
        {post.excerpt && <p className="text-sm leading-relaxed text-ink-dim">{post.excerpt}</p>}
        <span className="link-arrow mt-1 text-sm text-ink-bright">
          <span>Read more</span>
        </span>
      </div>
    </a>
  );
}

export default function InsightsPage() {
  const posts = getAllPosts();
  const ld = {
    "@type": "Blog",
    "@id": "https://stratumtech.ca/insights#blog",
    url: "https://stratumtech.ca/insights",
    name: "Insights for business leaders",
    description:
      "Practical, plain-language content on managed IT, cybersecurity, and business systems for business leaders.",
    publisher: { "@id": "https://stratumtech.ca/#organization" },
    inLanguage: "en-CA",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([
          breadcrumb([{ name: "Home", path: "/" }, { name: "Insights", path: "/insights" }]),
          ld,
        ])}
      />

      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Insights" }]}
        eyebrow="Insights & Resources"
        title="Insights for business leaders."
        lede="Practical, plain-language content on managed IT, cybersecurity, and business systems — written for the people running the business, not the IT team."
        backgroundVisual={{
          src: "/images/bg-hero-insights.webp",
          alt: "",
        }}
      />

      <section className="section bg-surface">
        <div className="container">
          {posts.length === 0 ? (
            <p className="rounded-md border border-dashed border-line bg-black/30 p-6 text-sm text-ink-faint">
              No insights published yet. Run the Notion sync to populate this section.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {posts.map((p, i) => (
                <PostCard key={p.slug} post={p} featured={i === 0} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABand
        title="Have a question that isn't answered here?"
        body="Talk to us directly. No pitch, no jargon — just a straight conversation about your situation."
      />
    </>
  );
}
