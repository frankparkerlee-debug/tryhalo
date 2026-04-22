import type { MetadataRoute } from "next";

const SITE_URL = "https://tryhalo.co";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/quiz", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/stack", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/hormone-therapy", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/testosterone-therapy", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/peptide-therapy", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/nad-therapy", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/connect", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/pricing", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/how-it-works", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.5, changeFrequency: "yearly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/hipaa", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
