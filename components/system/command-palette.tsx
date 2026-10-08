"use client";

import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  type Command,
  type Output,
  buildCommands,
  scoreCommand,
  signalsOutput,
} from "@/components/system/commands";
import { useFocusTrap, useScrollLock } from "@/lib/hooks";
import { addLog, closePalette, discover, useSystem } from "@/lib/system";

export default function CommandPalette() {
  const open = useSystem((s) => s.paletteOpen);
  if (!open) return null;
  return <Palette />;
}

function Palette() {
  const view = useSystem((s) => s.paletteView);
  const seed = useSystem((s) => s.paletteSeed);
  const router = useRouter();
  const pathname = usePathname();
  const listId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState(seed);
  const [active, setActive] = useState(0);
  const [output, setOutput] = useState<Output | null>(() => (view === "signals" ? signalsOutput() : null));

  useFocusTrap(dialogRef, true);
  useScrollLock(true);

  const commands = useMemo(() => buildCommands(), []);

  const results = useMemo(() => {
    const scored = commands
      .map((cmd, order) => ({ cmd, order, score: scoreCommand(cmd, query) }))
      .filter((r) => r.score >= 0);
    if (query.trim()) scored.sort((a, b) => b.score - a.score || a.order - b.order);
    return scored.map((r) => r.cmd);
  }, [commands, query]);

  // Group consecutive results for display while keeping one flat index for the keyboard.
  const groups = useMemo(() => {
    const out: { name: string; items: { cmd: Command; index: number }[] }[] = [];
    results.forEach((cmd, index) => {
      const name = query.trim() ? "Results" : cmd.group;
      const last = out[out.length - 1];
      if (last && last.name === name) last.items.push({ cmd, index });
      else out.push({ name, items: [{ cmd, index }] });
    });
    return out;
  }, [results, query]);

  const activeIndex = Math.min(active, Math.max(results.length - 1, 0));

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Keep the active option in view.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function run(cmd: Command | undefined) {
    if (!cmd) return;
    addLog("command", cmd.label);
    if (cmd.id === "whoami") discover("whoami");
    const result = cmd.run({
      pathname,
      navigate: (href) => {
        closePalette();
        router.push(href);
      },
    });
    if (result) {
      setOutput(result);
      setQuery("");
      return;
    }
    // Commands that navigate close themselves; everything else closes here.
    closePalette();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.isComposing) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (output) return;
        setActive((activeIndex + 1) % Math.max(results.length, 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (output) return;
        setActive((activeIndex - 1 + results.length) % Math.max(results.length, 1));
        break;
      case "Home":
        if (!output && !query) {
          e.preventDefault();
          setActive(0);
        }
        break;
      case "End":
        if (!output && !query) {
          e.preventDefault();
          setActive(results.length - 1);
        }
        break;
      case "Enter":
        e.preventDefault();
        if (output && !query) {
          setOutput(null);
          return;
        }
        if (output) setOutput(null);
        run(results[activeIndex]);
        break;
      case "Escape":
        e.preventDefault();
        e.stopPropagation();
        if (output) setOutput(null);
        else if (query) setQuery("");
        else closePalette();
        break;
      case "Backspace":
        if (output && !query) {
          e.preventDefault();
          setOutput(null);
        }
        break;
      case "Tab":
        // Focus stays in the input; Tab completes the active command's label.
        e.preventDefault();
        if (!output && results[activeIndex]) setQuery(results[activeIndex].label);
        break;
    }
  }

  const activeId = results[activeIndex] ? `${listId}-${activeIndex}` : undefined;

  return (
    <div className="fixed inset-0 z-[80]">
      <div
        className="absolute inset-0 bg-[var(--scrim)] [animation:fade_.2s_var(--ease-out)_both]"
        onClick={closePalette}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command line"
        onKeyDown={(e) => {
          if (e.key === "Escape") closePalette();
        }}
        className="palette absolute left-1/2 top-2 flex max-h-[calc(100svh-16px)] w-[calc(100%-16px)] max-w-[660px] -translate-x-1/2 flex-col overflow-hidden border border-ink/15 bg-paper shadow-[0_30px_80px_-20px_rgb(0_0_0/0.35)] sm:top-[12vh] sm:max-h-[min(76vh,640px)]"
      >
        <div className="flex h-14 flex-none items-center gap-3 border-b border-line px-4">
          <span aria-hidden="true" className="t-mono text-[18px] leading-none text-blue">
            ›
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
              if (output) setOutput(null);
            }}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded={!output}
            aria-controls={listId}
            aria-activedescendant={output ? undefined : activeId}
            aria-autocomplete="list"
            aria-label="Command"
            placeholder={output ? "Press enter to go back" : "Type a command, or ??? for a hint"}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="h-full min-w-0 flex-1 bg-transparent text-[17px] tracking-[-0.01em] text-ink outline-none placeholder:text-muted"
          />
          <button
            type="button"
            onClick={closePalette}
            className="kbd hit -mr-2 h-auto min-h-[44px] border-0 bg-transparent"
            aria-label="Close command line"
          >
            esc
          </button>
        </div>

        <div ref={listRef} className="scroll-quiet min-h-0 flex-1 overflow-y-auto overscroll-contain py-2">
          {output ? (
            <OutputView output={output} />
          ) : (
            <div id={listId} role="listbox" aria-label="Commands">
              {results.length === 0 ? (
                <p className="t-small px-4 py-6 text-muted">
                  No command matches “{query}”. Some only answer when you know their name.
                </p>
              ) : (
                groups.map((group) => (
                  <div key={group.name} role="group" aria-label={group.name}>
                    <div className="t-meta-sm px-4 pb-1 pt-3 text-muted" aria-hidden="true">
                      {group.name}
                    </div>
                    {group.items.map(({ cmd, index }) => {
                      const selected = index === activeIndex;
                      return (
                        <div
                          key={cmd.id}
                          id={`${listId}-${index}`}
                          data-index={index}
                          role="option"
                          aria-selected={selected}
                          onMouseMove={() => active !== index && setActive(index)}
                          onClick={() => run(cmd)}
                          className="relative mx-2 flex min-h-[44px] cursor-default items-center justify-between gap-4 px-3 text-[15px] tracking-[-0.01em] aria-selected:bg-paper-2"
                        >
                          <span
                            aria-hidden="true"
                            className={`absolute inset-y-2 left-0 w-[2px] bg-blue transition-transform duration-200 ${selected ? "scale-y-100" : "scale-y-0"}`}
                          />
                          <span className={cmd.group === "System" || cmd.hidden ? "t-mono text-[14px]" : ""}>
                            {cmd.label}
                          </span>
                          {cmd.hint ? (
                            <span className="t-meta-sm text-muted">
                              {cmd.hint}
                              {cmd.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                            </span>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="t-meta-sm flex h-9 flex-none items-center justify-between border-t border-line px-4 text-muted">
          <span className="hidden gap-4 sm:flex">
            {output ? (
              <>
                <span>↵ back</span>
                <span>esc back</span>
              </>
            ) : (
              <>
                <span>↑↓ select</span>
                <span>↵ run</span>
                <span>tab complete</span>
                <span>esc close</span>
              </>
            )}
          </span>
          <span className="sm:hidden">{output ? "Tap a command to run it" : `${results.length} commands`}</span>
          <span>FH / CMD</span>
        </div>
      </div>
    </div>
  );
}

function OutputView({ output }: { output: Output }) {
  return (
    <div className="px-4 pb-3 pt-2" role="status" aria-live="polite">
      <p className="t-mono mb-3 text-[13px] text-muted">
        <span className="text-blue">›</span> {output.prompt}
      </p>
      <div className="t-mono space-y-1 text-[14px] leading-[1.6]">
        {output.lines.map((line, i) =>
          typeof line === "string" ? (
            <p key={i} className="[animation:rise_.5s_var(--ease-out)_both]" style={{ animationDelay: `${i * 45}ms` }}>
              {line}
            </p>
          ) : (
            <Fragment key={i}>
              <div
                className="grid grid-cols-[11ch_1fr] gap-3 [animation:rise_.5s_var(--ease-out)_both]"
                style={{ animationDelay: `${i * 45}ms` }}
              >
                <span className="text-[12px] uppercase leading-[1.9] text-muted">{line.label}</span>
                <span
                  className={
                    line.tone === "blue"
                      ? "text-blue"
                      : line.tone === "signal"
                        ? "text-ink"
                        : line.tone === "muted"
                          ? "text-muted"
                          : ""
                  }
                >
                  {line.tone === "signal" ? <span className="mr-2 inline-block size-[5px] -translate-y-[2px] rotate-45 bg-signal" aria-hidden="true" /> : null}
                  {line.value}
                </span>
              </div>
            </Fragment>
          ),
        )}
      </div>
    </div>
  );
}
