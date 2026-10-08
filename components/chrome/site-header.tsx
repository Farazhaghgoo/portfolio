"use client";
import Link from "next/link";
import { InterlockMark } from "@/components/chrome/interlock-mark";
import { usePathname } from "next/navigation";
import { MobileMenu } from "@/components/chrome/mobile-menu";
import type { NavItem } from "@/lib/nav";
import { isActive } from "@/lib/paths";
import { openPalette, setMenuOpen, useSystem } from "@/lib/system";
export function SiteHeader({ nav }: { nav: NavItem[] }) {
 const pathname = usePathname();
 const menuOpen = useSystem(s => s.menuOpen);
 return <><header className="studio-header"><Link href="/" className="studio-logo" aria-label="Faraz Haghgoo, home"><InterlockMark /></Link>
 <nav aria-label="Primary"><ul>{nav.map(item => <li key={item.href}><Link href={item.href} aria-current={isActive(pathname,item.href) ? "page" : undefined}>{item.label}</Link></li>)}</ul></nav>
 <div className="studio-header-actions"><button onClick={() => openPalette()} aria-label="Open command palette" aria-keyshortcuts="/ Control+K Meta+K">⌘<span className="sr-only">Commands</span></button><a className="header-contact" href="#contact">Let’s talk ↗</a><button className="studio-menu-toggle" onClick={() => setMenuOpen(true)} aria-expanded={menuOpen} aria-controls="mobile-menu">Menu</button></div></header><MobileMenu nav={nav} /></>;
}
