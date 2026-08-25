import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

/** Small NE arrow used in buttons and arrow-links. */
export function ArrowNE({ size = 11 }: { size?: number }) {
  return (
    <svg data-arrow-ne width={size} height={size} viewBox="0 0 11 11" fill="none" aria-hidden>
      <path
        d="M9.3125 0H10.0625V0.75V8.25V9H8.5625V8.25V2.5625L1.59375 9.53125L1.0625 10.0625L0 9L0.53125 8.46875L7.5 1.5H1.8125H1.0625V0H1.8125H9.3125Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Small E arrow used in inline list links. */
export function ArrowE({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M10.7811 7.33327L7.20509 3.75726L8.14789 2.81445L13.3334 7.99993L8.14789 13.1853L7.20509 12.2425L10.7811 8.6666H2.66669V7.33327H10.7811Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Eyebrow "[ label ]" used across every section. */
export function BracketLabel({ children }: { children: ReactNode }) {
  return (
    <span className="bracket-label">
      <span className="bracket">[</span>
      <span>{children}</span>
      <span className="bracket">]</span>
    </span>
  );
}

type ButtonBaseProps = {
  children: ReactNode;
  className?: string;
  href: string;
  /** Defaults to the NE arrow. Pass `false` for text-only or a node for a custom icon. */
  icon?: ReactNode | false;
  iconPosition?: "start" | "end";
};

type ButtonLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "children" | "className" | "href"
> &
  ButtonBaseProps;

type ButtonActionProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "className"
> &
  Omit<ButtonBaseProps, "href"> & {
    href?: never;
  };

export type ButtonProps = ButtonLinkProps | ButtonActionProps;

/**
 * The single Stratum action button. It renders the correct native element for
 * navigation, downloads, form submits, and client-side actions.
 */
export function Button(props: ButtonProps) {
  const {
    children,
    className = "",
    icon,
    iconPosition = "end",
    ...elementProps
  } = props;
  const cls = `btn ${className}`.trim();
  const resolvedIcon = icon === false ? null : (icon ?? <ArrowNE />);
  const inner = (
    <>
      {iconPosition === "start" && resolvedIcon}
      <span>{children}</span>
      {iconPosition === "end" && resolvedIcon}
    </>
  );

  if ("href" in elementProps && typeof elementProps.href === "string") {
    const { href, ...anchorProps } = elementProps;
    const isExternal =
      href.startsWith("tel:") ||
      href.startsWith("mailto:") ||
      href.startsWith("http") ||
      anchorProps.download !== undefined;

    return isExternal ? (
      <a {...anchorProps} href={href} className={cls}>
        {inner}
      </a>
    ) : (
      <Link {...anchorProps} href={href} className={cls}>
        {inner}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = elementProps;

  return (
    <button {...buttonProps} type={type} className={cls}>
      {inner}
    </button>
  );
}

/** Underline-on-hover arrow link. */
export function ArrowLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  const isExternal = href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("http");
  const inner = (
    <>
      <span>{children}</span>
      <ArrowNE />
    </>
  );
  return isExternal ? (
    <a href={href} className={`link-arrow ${className}`.trim()}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={`link-arrow ${className}`.trim()}>
      {inner}
    </Link>
  );
}

/** Section heading block: eyebrow + optional small kicker + title + lede. */
export function SectionHeader({
  eyebrow,
  kicker,
  title,
  lede,
  center,
  className = "",
}: {
  eyebrow?: string;
  kicker?: string;
  title: ReactNode;
  lede?: ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <div
      data-reveal
      className={`flex flex-col gap-5 ${center ? "items-center text-center mx-auto" : ""} ${className}`.trim()}
    >
      {eyebrow && <BracketLabel>{eyebrow}</BracketLabel>}
      <div className="flex flex-col gap-4">
        {kicker && (
          <span className="text-sm font-semibold uppercase tracking-wider text-ink-faint">
            {kicker}
          </span>
        )}
        <h2 className="display-2 text-ink-bright">{title}</h2>
      </div>
      {lede && (
        <p className={`text-lg font-light text-ink-dim leading-relaxed ${center ? "max-w-2xl" : "max-w-xl"}`}>
          {lede}
        </p>
      )}
    </div>
  );
}

/** Uppercase feature chips with brand dots between them. */
export function ChipRow({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item, i) => (
        <span key={item} className="flex items-center gap-2">
          <span className="chip">{item}</span>
          {i < items.length - 1 && <span className="chip-dot" />}
        </span>
      ))}
    </div>
  );
}
