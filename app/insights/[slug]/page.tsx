import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getAllPosts, getPost, formatPostDate } from "@/lib/insights";
import { PageHero } from "@/components/sections";
import PostBody from "@/components/PostBody";
import CTABand from "@/components/CTABand";
import { jsonLd } from "@/lib/site";
import { pageMeta, breadcrumb } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const description = post.excerpt || `${post.title} — insights from Stratum.`;
  return pageMeta({
    title: post.title,
    description,
    path: `/insights/${post.slug}`,
    ogTitle: `${post.title} | Stratum`,
    ogDescription: description,
  });
}

export default async function InsightPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const date = formatPostDate(post.date);
  const ld = {
    "@type": "BlogPosting",
    "@id": `https://www.stratumtech.ca/insights/${post.slug}#article`,
    headline: post.title,
    ...(post.date ? { datePublished: post.date } : {}),
    ...(post.cover ? { image: `https://www.stratumtech.ca${post.cover.src}` } : {}),
    ...(post.excerpt ? { description: post.excerpt } : {}),
    url: `https://www.stratumtech.ca/insights/${post.slug}`,
    isPartOf: { "@id": "https://www.stratumtech.ca/insights#blog" },
    publisher: { "@id": "https://www.stratumtech.ca/#organization" },
    inLanguage: "en-CA",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/insights" },
            { name: post.title, path: `/insights/${post.slug}` },
          ]),
          ld,
        ])}
      />

      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Insights", href: "/insights" }, { label: post.title }]}
        eyebrow={date || "Insight"}
        title={post.title}
        lede={post.excerpt || `A ${post.readingMinutes}-minute read from the Stratum team.`}
      />

      <article className="section bg-surface">
        <div className="container max-w-3xl">
          {post.cover && (
            <div data-reveal className="mb-10 overflow-hidden rounded-md border border-line-soft bg-black">
              <Image
                src={post.cover.src}
                alt={`Cover image for “${post.title}”`}
                width={post.cover.width ?? 1600}
                height={post.cover.height ?? 900}
                priority
                sizes="(min-width: 768px) 768px, 100vw"
                className="h-auto w-full"
              />
            </div>
          )}
          <div data-reveal>
            <PostBody markdown={post.markdown} images={post.images} />
          </div>
        </div>
      </article>

      <CTABand
        title="Have a question about your own setup?"
        body="Talk to us directly. No pitch, no jargon — just a straight conversation about your situation."
      />
    </>
  );
}
