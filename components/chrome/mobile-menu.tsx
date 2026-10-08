"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { LocalTime } from "@/components/chrome/local-time";
import { profile } from "@/data/profile";
import { contactHref, social } from "@/data/social";
import { pad } from "@/lib/content";
import { useFocusTrap, useScrollLock } from "@/lib/hooks";
import type { NavItem } from "@/lib/nav";
import { isActive } from "@/lib/paths";
import { SIGNAL_TOTAL, cycleTheme, openPalette, setMenuOpen, useSystem } from "@/lib/system";

export function MobileMenu({ nav }: { nav: NavItem[] }) {
  const open = useSystem((s) => s.menuOpen);
  const theme = useSystem((s) => s.theme);
  const found = useSystem((s) => s.found.length);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const contact = contactHref();

  useFocusTrap(ref, open);
  useScrollLock(open);

  // Close on navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-paper md:hidden"
    >
      <div className="frame flex h-[var(--header-h)] flex-none items-center justify-between">
        <span className="t-small font-medium tracking-[-0.01em]">{profile.name}</span>
        <button
          ref={closeRef}
          type="button"
          onClick={() => setMenuOpen(false)}
          className="hit -mr-2 inline-flex items-center justify-center px-2 text-[13.5px]"
        >
          Close
        </button>
      </div>

      <nav aria-label="Primary" className="frame flex-1 pt-6">
        <p className="t-meta mb-3 text-muted">Index</p>
        <ul className="rule">
          {[{ label: "Home", href: "/" } as NavItem, ...nav].map((item, i) => {
            const active = isActive(pathname, item.href);
            return (
              <li
                key={item.href}
                className="load-rise border-b border-line"
                style={{ ["--i" as string]: i } as React.CSSProperties}
              >
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className="flex min-h-[64px] items-center justify-between py-2 text-[clamp(34px,10vw,48px)] font-medium leading-none tracking-[-0.045em] aria-[current=page]:text-blue"
                >
                  <span>{item.label}</span>
                  {item.count ? (
                    <span className="t-meta text-muted" aria-label={`${item.count} entries`}>
                      {pad(item.count, 2)}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => openPalette()}
            className="hit flex items-center justify-between border border-line px-4 text-left text-[15px]"
          >
            Command line <span className="kbd">/</span>
          </button>
          <button
            type="button"
            onClick={cycleTheme}
            className="hit flex items-center justify-between border border-line px-4 text-left text-[15px]"
            aria-label={`Theme: ${theme}. Change theme.`}
          >
            Theme <span className="t-meta text-muted">{theme}</span>
          </button>
        </div>
      </nav>

      <div className="frame flex-none pb-[max(24px,env(safe-area-inset-bottom))] pt-10">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
          <li>
            <a href={contact.href} {...(contact.external ? { target: "_blank", rel: "noreferrer" } : {})} className="hit inline-flex items-center">
              Contact ↗
            </a>
          </li>
          <li>
            <a href={social.linkedin.href} target="_blank" rel="noreferrer" className="hit inline-flex items-center">
              LinkedIn ↗
            </a>
          </li>

        </ul>
        <p className="t-meta mt-4 flex justify-between text-muted">
          <span>
            {profile.location.city} / {profile.location.country} · <LocalTime />
          </span>
          {found > 0 ? (
            <span>
              {found}/{SIGNAL_TOTAL} signals
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
}
