import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/chrome/site-footer";
import { SiteHeader } from "@/components/chrome/site-header";
import { SystemLayer } from "@/components/system/system-layer";
import { site } from "@/data/site";
import { getNav } from "@/lib/nav";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// The Google "latin" subset of Geist has no arrows (→ ← ↗). These ~2 KB
// subsets of the official variable fonts fill that gap, and only that gap.
// (Font loader options must be literals, hence the repetition.)
const geistArrows = localFont({
  src: "./fonts/geist-arrows.woff2",
  variable: "--font-geist-arrows",
  weight: "100 900",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+2190-2199" }],
});

const geistMonoArrows = localFont({
  src: "./fonts/geist-mono-arrows.woff2",
  variable: "--font-geist-mono-arrows",
  weight: "100 900",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+2190-2199" }],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: site.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1eee6" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e0d" },
  ],
  colorScheme: "light dark",
};

// Runs before first paint: applies a stored theme and marks JS as available.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('fh:theme');if(t==='paper'||t==='night')d.setAttribute('data-theme',t)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  const nav = getNav();
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${geistArrows.variable} ${geistMonoArrows.variable} ${instrument.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a
          href="#content"
          className="sr-only-focusable fixed left-3 top-3 z-[100] bg-blue px-4 py-3 text-on-blue t-meta"
        >
          Skip to content
        </a>
        <SiteHeader nav={nav} />
        <main id="content" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
        <SystemLayer />
      </body>
    </html>
  );
}
