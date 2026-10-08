"use client";

import { openPalette } from "@/lib/system";

export function OpenPaletteButton({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={() => openPalette()} className={className}>
      {children}
    </button>
  );
}
