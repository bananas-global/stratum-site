"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { NAV } from "@/lib/site";
import { ArrowE, Button } from "./ui";

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
  const barRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false); // mobile menu
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  // The homepage starts over a light hero. Deriving the initial state from the
  // route avoids swapping the priority logo immediately after hydration.
  const [lightNav, setLightNav] = useState(() => pathname === "/");

  useEffect(() => {
    setOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Element && !event.target.closest("[data-nav-dropdown]")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);

  const updateNav = useCallback(() => {
    setScrolled(window.scrollY > 24);

    const bar = barRef.current;
    if (!bar) return;

    const probeY = bar.getBoundingClientRect().top + bar.getBoundingClientRect().height / 2;
    const overLight = Array.from(document.querySelectorAll(".section-light")).some((section) => {
      const rect = section.getBoundingClientRect();
      return probeY >= rect.top && probeY <= rect.bottom;
    });
    setLightNav(overLight);
  }, []);

  useEffect(() => {
    updateNav();
    window.addEventListener("scroll", updateNav, { passive: true });
    window.addEventListener("resize", updateNav, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateNav);
      window.removeEventListener("resize", updateNav);
    };
  }, [pathname, updateNav]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-[999] py-5">
      {/* Mobile menu backdrop — dims the page behind the open panel; tap to close.
          lg:hidden so it never affects desktop. -z-10 keeps it behind the bar/panel
          but (within the header's z-[999] stacking context) above page content. */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={[
          "fixed inset-0 -z-10 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      />
      <div className="container">
        <div
          ref={barRef}
          className={[
            "nav-shell relative flex items-center justify-between rounded-sm p-2",
            scrolled || open ? "is-scrolled" : "",
            lightNav ? "nav-light" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {/* Logo */}
          <div className="flex flex-1 items-center">
            <Link href="/" aria-label="Stratum — Home" className="block py-1.5">
              <Image
                src={
                  lightNav
                    ? "/brand/stratum-logo-black-mono.svg"
                    : "/brand/stratum-logo-white-mono.svg"
                }
                alt="Stratum"
                width={144}
                height={28}
                priority
                className="nav-logo h-6 w-auto pl-2 transition-opacity duration-300"
              />
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center lg:flex">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.label} className="relative" data-nav-dropdown
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) setActiveDropdown(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setActiveDropdown(null);
                      event.currentTarget.querySelector("button")?.focus();
                    }
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={activeDropdown === item.href}
                    aria-controls={`nav-dropdown-${item.label}`}
                    onClick={() => setActiveDropdown(activeDropdown === item.href ? null : item.href)}
                    className={`flex items-center gap-1 whitespace-nowrap px-4 py-1.5 text-[1.0625rem] font-medium transition-colors ${
                      isActive(item.href) ? "text-ink-bright" : "text-ink-dim hover:text-ink-bright"
                    }`}
                  >
                    {item.label}
                    <span className={`text-ink-faint transition-transform duration-300 ${activeDropdown === item.href ? "rotate-180" : ""}`}>
                      <ChevronDown />
                    </span>
                  </button>
                  {/* Dropdown */}
                  <div id={`nav-dropdown-${item.label}`} hidden={activeDropdown !== item.href} className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
                    <div className="glass min-w-[20rem] rounded-sm p-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setActiveDropdown(null)}
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
                  className={`whitespace-nowrap px-4 py-1.5 text-[1.0625rem] font-medium transition-colors ${
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
            <Button href="/contact" className="hidden sm:inline-flex">
              Get in touch
            </Button>
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
          className={[
            "nav-mobile-panel mt-2 origin-top overflow-hidden rounded-sm transition-all duration-300 lg:hidden",
            lightNav ? "nav-light" : "",
            open ? "max-h-[80vh] opacity-100" : "pointer-events-none max-h-0 opacity-0",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="flex flex-col gap-1 p-4">
            {NAV.map((item) => (
              <div key={item.label} className="flex flex-col" data-nav-dropdown>
                {item.children ? (
                  <button
                    type="button"
                    data-nav-dropdown
                    aria-expanded={activeDropdown === item.href}
                    aria-controls={`mobile-dropdown-${item.label}`}
                    onClick={() => setActiveDropdown(activeDropdown === item.href ? null : item.href)}
                    className="flex items-center gap-1 py-2 text-left text-[1.0625rem] font-medium text-ink-bright"
                  >
                    {item.label}
                    <ChevronDown />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`py-2 text-[1.0625rem] font-medium ${isActive(item.href) ? "text-ink-bright" : "text-ink-dim"}`}
                  >
                    {item.label}
                  </Link>
                )}
                {item.children && (
                  <div id={`mobile-dropdown-${item.label}`} hidden={activeDropdown !== item.href}>
                  <div className="mb-2 ml-3 flex flex-col gap-1 border-l border-line pl-3">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href} onClick={() => { setActiveDropdown(null); setOpen(false); }} className="py-1.5 text-sm text-ink-faint">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                  </div>
                )}
              </div>
            ))}
            <Button href="/contact" className="mt-3 w-full">
              Get in touch
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
