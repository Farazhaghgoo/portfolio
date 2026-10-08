/**
 * Site-level settings.
 *
 * The canonical URL comes from NEXT_PUBLIC_SITE_URL. On Vercel it falls back
 * to the production domain automatically. Set NEXT_PUBLIC_SITE_URL once a
 * custom domain exists.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const site = {
  url: resolveSiteUrl(),
  name: "Faraz Haghgoo",
  title: "Faraz Haghgoo — Software Developer & Product Builder",
  description:
    "Software developer and product builder based in Turin, working across digital products, interfaces, systems and AI-enabled experiences.",
  locale: "en_GB",
  /** Shown in the footer as FH / {year}. */
  year: "2026",
  version: "1.0",
} as const;
