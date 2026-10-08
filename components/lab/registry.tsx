"use client";

import dynamic from "next/dynamic";

function Loading() {
  return (
    <div className="t-meta flex h-[min(74svh,62vw)] min-h-[420px] items-center justify-center border border-line bg-paper-2 text-muted">
      Loading experiment…
    </div>
  );
}

// Each experiment is its own chunk, loaded only on its page.
const registry: Record<string, React.ComponentType> = {
  field: dynamic(() => import("@/components/lab/field"), { ssr: false, loading: Loading }),
  entropy: dynamic(() => import("@/components/lab/entropy"), { ssr: false, loading: Loading }),
};

export function Experiment({ slug }: { slug: string }) {
  const Component = registry[slug];
  if (!Component) {
    return (
      <div className="t-meta flex h-[40svh] items-center justify-center border border-line text-muted">
        This experiment has no component registered yet.
      </div>
    );
  }
  return <Component />;
}
