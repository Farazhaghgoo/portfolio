import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Nothing buried publicly yet.
      disallow: ["/graveyard"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
