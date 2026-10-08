import Link from "next/link";
import { OpenPaletteButton } from "@/components/system/open-palette-button";

export default function NotFound() {
  return (
    <div data-page className="frame flex min-h-[86svh] flex-col pt-[calc(var(--header-h)+clamp(32px,6vw,104px))]">
      <p className="t-meta load-fade text-muted">
        <span className="text-ink">FH</span>—404 / No signal
      </p>
      <h1 className="t-display load-rise mt-8 text-[clamp(96px,26vw,420px)] text-ink">404</h1>
      <div className="grid-12 mt-auto gap-y-6 pt-16">
        <p className="t-lead load-fade col-span-12 max-w-[36ch] pretty md:col-span-6" style={{ ["--i" as string]: 2 } as React.CSSProperties}>
          This page isn’t in the index. It may have moved, or it never existed. Either way, nothing is broken.
        </p>
        <div className="load-fade col-span-12 flex flex-wrap items-end gap-x-8 gap-y-2 md:col-span-6 md:justify-end" style={{ ["--i" as string]: 3 } as React.CSSProperties}>
          <Link href="/" className="hit inline-flex items-center gap-2 text-[15px] link-under">
            <span aria-hidden="true">←</span> Home
          </Link>
          <Link href="/archive" className="hit inline-flex items-center gap-2 text-[15px] link-under">
            Archive
          </Link>
          <OpenPaletteButton className="hit inline-flex items-center gap-2 text-[15px] link-under">
            Search with the command line <span className="kbd">/</span>
          </OpenPaletteButton>
        </div>
      </div>
    </div>
  );
}
