"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks";

const INTERVAL = 4200;

/**
 * Cycles slowly through a few true statements, once, and rests on the last.
 * Pauses on hover and focus. Click or tap to advance by hand.
 */
export function Rotator({ phrases }: { phrases: readonly string[] }) {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [auto, setAuto] = useState(true);
  const paused = useRef(false);
  const reduced = useReducedMotion();

  const go = (next: number) => {
    setPrev(index);
    setIndex(next % phrases.length);
  };

  useEffect(() => {
    if (!auto || reduced || index >= phrases.length - 1) return;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      if (paused.current || document.hidden) {
        timer = setTimeout(step, 800);
        return;
      }
      setPrev(index);
      setIndex(index + 1);
    };
    timer = setTimeout(step, INTERVAL);
    return () => clearTimeout(timer);
  }, [index, auto, reduced, phrases.length]);

  return (
    <button
      type="button"
      onClick={() => {
        setAuto(false);
        go(index + 1);
      }}
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
      data-cursor-label="Next"
      className="group flex max-w-full items-start gap-3 text-left"
      aria-label={`${phrases[index]} Show the next line.`}
    >
      <span className="dot dot-live mt-[0.55em]" aria-hidden="true" />
      <span className="relative grid min-w-0 overflow-clip" aria-hidden="true">
        <span key={`in-${index}`} className={`col-start-1 row-start-1 ${prev !== null ? "rot-in" : ""}`}>
          {phrases[index]}
        </span>
        {prev !== null && prev !== index ? (
          <span key={`out-${prev}-${index}`} className="col-start-1 row-start-1 rot-out">
            {phrases[prev]}
          </span>
        ) : null}
      </span>
    </button>
  );
}
