/**
 * The mark: two layers. The top one is the part everyone sees.
 * The second sits slightly offset, the part you find by looking.
 */
export function Mark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <rect x="3" y="5" width="18" height="6" fill="currentColor" />
      <rect x="7" y="13" width="14" height="6" fill="var(--blue)" />
    </svg>
  );
}
