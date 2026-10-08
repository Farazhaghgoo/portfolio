"use client";

import { useEffect } from "react";
import { discover } from "@/lib/system";

/** Marks a signal as found when the page it lives on is shown. */
export function SignalOnMount({ id }: { id: string }) {
  useEffect(() => {
    // A beat later, so the toast doesn't compete with the page arriving.
    const t = setTimeout(() => discover(id), 900);
    return () => clearTimeout(t);
  }, [id]);
  return null;
}
