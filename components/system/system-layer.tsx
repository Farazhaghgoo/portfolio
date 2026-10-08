"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Cursor } from "@/components/system/cursor";
import { SignalToast } from "@/components/system/signal-toast";
import { isTypingTarget } from "@/lib/hooks";
import { addLog, getSystem, hydrateSystem, openLog, togglePalette, useSystem } from "@/lib/system";

// Heavier pieces load on demand, then stay.
const loadPalette = () => import("@/components/system/command-palette");
const CommandPalette = dynamic(loadPalette, { ssr: false });
const InspectOverlay = dynamic(() => import("@/components/system/inspect-overlay"), { ssr: false });
const SessionLog = dynamic(() => import("@/components/system/session-log"), { ssr: false });

const SEQUENCE = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];

export function SystemLayer() {
  const paletteOpen = useSystem((s) => s.paletteOpen);
  const inspect = useSystem((s) => s.inspect);
  const logOpen = useSystem((s) => s.logOpen);
  const [palettePrimed, setPalettePrimed] = useState(false);

  useEffect(() => {
    hydrateSystem();
    // Warm the palette while the browser is idle so "/" opens instantly.
    const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1200));
    idle(() => void loadPalette());
  }, []);

  if (paletteOpen && !palettePrimed) setPalettePrimed(true);

  // Global keys: "/" and Cmd/Ctrl+K open the command line; the old code opens the log.
  useEffect(() => {
    let progress = 0;
    function onKey(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && key === "k") {
        e.preventDefault();
        togglePalette();
        return;
      }
      if (isTypingTarget(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      const s = getSystem();
      if (key === "/" && !s.paletteOpen && !s.logOpen) {
        e.preventDefault();
        togglePalette();
        return;
      }
      if (key === SEQUENCE[progress]) progress += 1;
      else if (key === SEQUENCE[0]) progress = progress === 2 ? 2 : 1;
      else progress = 0;
      if (progress === SEQUENCE.length) {
        progress = 0;
        openLog();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <RouteEffects />
      <Cursor />
      <SignalToast />
      {palettePrimed ? <CommandPalette /> : null}
      {inspect ? <InspectOverlay /> : null}
      {logOpen ? <SessionLog /> : null}
    </>
  );
}

let lastPath: string | null = null;

/** Per-navigation housekeeping: the session log and the soft page entry. */
function RouteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    if (lastPath === pathname) return;
    // Only client-side navigations get the soft entry, never the first load.
    if (lastPath !== null) document.documentElement.setAttribute("data-navigated", "");
    lastPath = pathname;
    addLog("route", decodeURIComponent(pathname));
  }, [pathname]);

  return null;
}
