import { profile } from "@/data/profile";
import { site } from "@/data/site";
import { social } from "@/data/social";

/** Structured data for the person behind the site. */
export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: site.url,
    jobTitle: "Software Developer & Product Builder",
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location.city,
      addressCountry: "IT",
    },
    knowsAbout: [
      "Software development",
      "Product development",
      "Frontend engineering",
      "Interaction design",
      "Human–computer interaction",
      "AI-enabled products",
    ],
    sameAs: [social.linkedin.href],
  };
  return (
    <script
      type="application/ld+json"
      // Escape "<" so the payload can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
