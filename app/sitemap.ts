import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // Use the www subdomain — apex DNS isn't configured, so URLs at the
  // bare domain don't resolve. Advertising apex URLs (in sitemap, canonical,
  // OG tags, etc.) caused Google's favicon service to fetch http://insureitgroup.net
  // and silently fail, falling back to the default globe icon in search results.
  const base = "https://www.insureitgroup.net";
  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/#quote`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/#contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
