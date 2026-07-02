import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import type { PostImage } from "@/lib/insights";

// Renders post markdown in the site's editorial voice. Inline images resolve to
// local /public paths (baked by notion-sync) and render through next/image using
// the dimensions captured at sync time. External links open in a new tab.
export default function PostBody({
  markdown,
  images,
}: {
  markdown: string;
  images: Record<string, PostImage>;
}) {
  return (
    <div className="prose-post flex flex-col gap-6 text-lg leading-relaxed text-ink-dim">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="mt-6 font-display text-[1.40625rem] leading-[1.6875rem] text-ink-bright">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-4 font-display text-[1.125rem] leading-[1.5rem] text-ink-bright">{children}</h3>
          ),
          p: ({ children }) => <p>{children}</p>,
          ul: ({ children }) => (
            <ul className="flex list-disc flex-col gap-2 pl-6 marker:text-brand-light">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="flex list-decimal flex-col gap-2 pl-6 marker:text-brand-light">{children}</ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          a: ({ href, children }) => {
            const external = !!href && /^https?:\/\//.test(href);
            return (
              <a
                href={href}
                className="text-brand-light underline decoration-brand/40 underline-offset-4 transition-colors hover:text-ink-bright"
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {children}
              </a>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-brand pl-5 text-ink-faint italic">{children}</blockquote>
          ),
          strong: ({ children }) => <strong className="font-semibold text-ink-bright">{children}</strong>,
          hr: () => <hr className="border-line-soft" />,
          img: ({ src, alt }) => {
            if (typeof src !== "string") return null;
            const dims = images[src];
            return (
              <span className="my-2 block overflow-hidden rounded-md border border-line-soft bg-surface">
                <Image
                  src={src}
                  alt={alt ?? dims?.alt ?? ""}
                  width={dims?.width ?? 1200}
                  height={dims?.height ?? 800}
                  sizes="(min-width: 768px) 720px, 100vw"
                  className="h-auto w-full"
                />
              </span>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
