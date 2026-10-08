import type { MetadataRoute } from "next";
import { now } from "@/data/now";
import { site } from "@/data/site";
import { getLab, getWork } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path}`;
  return [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    { url: url("/work"), changeFrequency: "monthly", priority: 0.9 },
    { url: url("/about"), changeFrequency: "yearly", priority: 0.8 },
    { url: url("/archive"), changeFrequency: "monthly", priority: 0.6 },
    { url: url("/now"), lastModified: `${now.updated}-01`, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/lab"), changeFrequency: "monthly", priority: 0.5 },
    ...getWork().map((w) => ({ url: url(`/work/${w.slug}`), changeFrequency: "yearly" as const, priority: 0.8 })),
    ...getLab().map((l) => ({ url: url(`/lab/${l.slug}`), changeFrequency: "yearly" as const, priority: 0.4 })),
  ];
}
