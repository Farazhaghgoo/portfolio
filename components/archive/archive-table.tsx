"use client";

import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import { pad, statusLabel } from "@/lib/content";
import type { ArchiveRecord, Status } from "@/lib/types";

type SortKey = "no" | "title" | "type" | "status" | "year";

const COLUMNS: { key: SortKey; label: string; className: string }[] = [
  { key: "no", label: "Index", className: "w-[8%]" },
  { key: "title", label: "Name", className: "w-[34%]" },
  { key: "type", label: "Type", className: "w-[26%]" },
  { key: "status", label: "Status", className: "w-[14%]" },
  { key: "year", label: "Year", className: "w-[10%]" },
];

const statusMark: Record<Status, string> = {
  shipped: "bg-ink",
  ongoing: "bg-blue",
  experiment: "border border-blue",
  prototype: "border border-ink",
  private: "bg-ink rotate-45",
  archived: "bg-faint",
};

export function ArchiveTable({ records }: { records: ArchiveRecord[] }) {
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "no", dir: 1 });
  const [filter, setFilter] = useState<Status | "all">("all");
  const [open, setOpen] = useState<string | null>(null);

  const statuses = useMemo(() => {
    const counts = new Map<Status, number>();
    records.forEach((r) => counts.set(r.status, (counts.get(r.status) ?? 0) + 1));
    return [...counts.entries()];
  }, [records]);

  const rows = useMemo(() => {
    const filtered = filter === "all" ? records : records.filter((r) => r.status === filter);
    const val = (r: ArchiveRecord): string | number => {
      if (sort.key === "no") return r.no;
      if (sort.key === "year") return r.year ? parseInt(r.year, 10) : 0;
      if (sort.key === "title" && r.redacted) return "~";
      return String(r[sort.key]).toLowerCase();
    };
    return [...filtered].sort((a, b) => {
      const va = val(a);
      const vb = val(b);
      return (va < vb ? -1 : va > vb ? 1 : a.no - b.no) * sort.dir;
    });
  }, [records, filter, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }));

  return (
    <div data-spec="Component / ArchiveTable">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div role="group" aria-label="Filter by status" className="t-meta -ml-2 flex flex-wrap">
          {[["all", records.length] as const, ...statuses].map(([key, count]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className="hit inline-flex items-center gap-1.5 px-2 text-muted transition-colors hover:text-ink aria-pressed:text-blue"
            >
              {key === "all" ? "All" : statusLabel[key]}
              <span className="text-faint">{pad(count, 2)}</span>
            </button>
          ))}
        </div>
        <p className="t-meta text-muted" aria-live="polite">
          Showing {pad(rows.length, 2)} / {pad(records.length, 2)}
        </p>
      </div>

      <table role="table" className="mt-4 w-full border-collapse text-left">
        <caption className="sr-only">
          Archive of work, experiments and other records. Column headers sort the table.
        </caption>
        <thead role="rowgroup" className="max-md:sr-only">
          <tr role="row" className="t-meta border-t border-ink">
            {COLUMNS.map((col) => {
              const active = sort.key === col.key;
              return (
                <th
                  key={col.key}
                  role="columnheader"
                  scope="col"
                  aria-sort={active ? (sort.dir === 1 ? "ascending" : "descending") : "none"}
                  className={`${col.className} p-0 font-normal`}
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className="inline-flex min-h-[40px] items-center gap-1.5 text-muted transition-colors hover:text-ink aria-[current=true]:text-ink"
                    aria-current={active}
                  >
                    {col.label}
                    <span aria-hidden="true" className={`transition-opacity ${active ? "opacity-100" : "opacity-0"}`}>
                      {sort.dir === 1 ? "↑" : "↓"}
                    </span>
                  </button>
                </th>
              );
            })}
            <th role="columnheader" scope="col" className="w-[8%] p-0">
              <span className="sr-only">Details</span>
            </th>
          </tr>
        </thead>
        <tbody role="rowgroup" className="max-md:border-t max-md:border-ink">
          {rows.map((r) => {
            const isOpen = open === r.key;
            const detailId = `archive-${r.key.replace(/[^a-z0-9]/gi, "-")}`;
            return (
              <Fragment key={r.key}>
                <tr
                  role="row"
                  className="group border-b border-line align-baseline max-md:grid max-md:grid-cols-[5ch_1fr_auto] max-md:gap-x-3 max-md:py-3"
                >
                  <td role="cell" className="t-meta py-4 text-muted max-md:row-span-2 max-md:py-0 max-md:pt-1.5">
                    {pad(r.no)}
                  </td>
                  <td role="cell" className="py-4 pr-4 text-[clamp(18px,1.5vw,24px)] leading-tight tracking-[-0.025em] max-md:py-0">
                    {r.redacted ? (
                      <>
                        <span className="redacted" aria-hidden="true">
                          {r.title}
                        </span>
                        <span className="sr-only">Name withheld</span>
                      </>
                    ) : r.href ? (
                      <Link href={r.href} className="link-under" data-cursor-label="Open">
                        {r.title}
                      </Link>
                    ) : (
                      r.title
                    )}
                  </td>
                  <td role="cell" className="t-small py-4 pr-4 text-ink-2 max-md:col-start-2 max-md:row-start-2 max-md:py-0 max-md:text-[13px] max-md:text-muted">
                    {r.type}
                  </td>
                  <td role="cell" className="t-meta py-4 max-md:hidden">
                    <span className="inline-flex items-center gap-2">
                      <span aria-hidden="true" className={`size-[6px] ${statusMark[r.status]}`} />
                      {statusLabel[r.status]}
                    </span>
                  </td>
                  <td role="cell" className="t-meta py-4 text-muted max-md:hidden">
                    {r.year ?? "—"}
                  </td>
                  <td role="cell" className="py-1 text-right max-md:col-start-3 max-md:row-span-2 max-md:row-start-1 max-md:py-0">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : r.key)}
                      aria-expanded={isOpen}
                      aria-controls={detailId}
                      className="hit -mr-3 inline-flex items-center justify-center"
                    >
                      <span className="sr-only">
                        {isOpen ? "Hide" : "Show"} details{r.redacted ? "" : ` for ${r.title}`}
                      </span>
                      <span aria-hidden="true" className="relative block size-3">
                        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ink" />
                        <span className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink transition-transform duration-500 ${isOpen ? "scale-y-0" : ""}`} />
                      </span>
                    </button>
                  </td>
                </tr>
                <tr role="row" id={detailId} hidden={!isOpen} className="border-b border-line max-md:block">
                  <td role="cell" colSpan={6} className="max-md:block">
                    <div className="grid-12 gap-y-3 py-5 [animation:rise_.5s_var(--ease-out)_both]">
                      <div className="t-meta col-span-12 flex gap-4 text-muted md:col-span-3 md:col-start-2 md:block md:space-y-1">
                        <p className="flex items-center gap-2">
                          <span aria-hidden="true" className={`size-[6px] ${statusMark[r.status]}`} />
                          {statusLabel[r.status]}
                        </p>
                        <p>{r.year ?? "Year —"}</p>
                        <p>Source / {r.source}</p>
                      </div>
                      <p className="t-body col-span-12 max-w-[56ch] text-ink-2 pretty md:col-span-6">{r.summary}</p>
                      {r.href ? (
                        <p className="col-span-12 md:col-span-2 md:text-right">
                          <Link href={r.href} className="hit inline-flex items-center gap-2 text-[15px] link-under">
                            Open <span aria-hidden="true">→</span>
                          </Link>
                        </p>
                      ) : null}
                    </div>
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>

      <p className="t-meta mt-6 flex flex-wrap gap-x-6 gap-y-2 text-muted" aria-label="Legend">
        {(Object.keys(statusLabel) as Status[]).map((s) => (
          <span key={s} className="inline-flex items-center gap-2">
            <span aria-hidden="true" className={`size-[6px] ${statusMark[s]}`} />
            {statusLabel[s]}
          </span>
        ))}
      </p>
    </div>
  );
}
