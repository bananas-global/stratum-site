"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, SITE } from "@/lib/site";
import { ArrowE } from "./ui";

function ChevronDown() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M11.9997 13.1714L16.9495 8.22168L18.3637 9.63589L11.9997 15.9999L5.63574 9.63589L7.04996 8.22168L11.9997 13.1714Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // mobile menu
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-[999] px-[3%] py-5">
      <div className="mx-auto max-w-[64rem]">
        <div
          className={`relative flex items-center justify-between rounded-sm border border-line-soft py-1 pl-4 pr-1 transition-colors duration-300 ${
            scrolled || open ? "bg-surface/70 backdrop-blur-lg" : "bg-surface/30 backdrop-blur-lg"
          }`}
        >
          {/* Logo */}
          <div className="flex flex-1 items-center">
            <Link href="/" aria-label="Stratum — Home" className="block py-1.5">
              <Image
                src="/images/logo.svg"
                alt="Stratum"
                width={144}
                height={28}
                priority
                className="h-6 w-auto"
              />
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center lg:flex">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.label} className="group relative">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 whitespace-nowrap px-4 py-1.5 text-[13px] transition-colors ${
                      isActive(item.href) ? "text-ink-bright" : "text-ink-dim hover:text-ink-bright"
                    }`}
                  >
                    {item.label}
                    <span className="text-ink-faint transition-transform duration-300 group-hover:rotate-180">
                      <ChevronDown />
                    </span>
                  </Link>
                  {/* Dropdown */}
                  <div className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                    <div className="glass min-w-[20rem] rounded-sm p-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-start gap-3 rounded-[2px] p-3 transition-colors hover:bg-white/10"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-medium text-ink-bright">{child.label}</span>
                              <span className="text-ink-faint">
                                <ArrowE size={14} />
                              </span>
                            </div>
                            <div className="text-sm text-ink-faint">{child.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`whitespace-nowrap px-4 py-1.5 text-[13px] transition-colors ${
                    isActive(item.href) ? "text-ink-bright" : "text-ink-dim hover:text-ink-bright"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Right actions */}
          <div className="flex flex-1 items-center justify-end gap-2">
            <a href={SITE.phoneHref} className="btn btn-secondary hidden sm:inline-flex">
              <span>Talk to a Human</span>
            </a>
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-11 w-11 items-center justify-center rounded-sm text-ink-bright lg:hidden"
            >
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden>
                {open ? (
                  <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                ) : (
                  <path
                    d="M2.75 12H21.25M2.75 5.75H21.25M2.75 18.25H11.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`mt-2 origin-top overflow-hidden rounded-sm border border-line-soft bg-surface/80 backdrop-blur-lg transition-all duration-300 lg:hidden ${
            open ? "max-h-[80vh] opacity-100" : "pointer-events-none max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-1 p-4">
            {NAV.map((item) => (
              <div key={item.label} className="flex flex-col">
                <Link
                  href={item.href}
                  className={`py-2 text-base ${isActive(item.href) ? "text-ink-bright" : "text-ink-dim"}`}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="mb-2 ml-3 flex flex-col gap-1 border-l border-line pl-3">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href} className="py-1.5 text-sm text-ink-faint">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <a href={SITE.phoneHref} className="btn btn-primary mt-3 w-full">
              <span>Talk to a Human</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
