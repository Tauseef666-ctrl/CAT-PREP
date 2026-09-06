import type { MetadataRoute } from "next";
import { SITE_URL } from "./robots";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "", "/onboarding", "/dashboard", "/learn", "/syllabus", "/practice", "/today",
    "/reading", "/rc-lab", "/pyq", "/tests", "/revision", "/mistakes",
    "/quick", "/planner", "/analytics", "/report", "/time-pressure", "/challenge",
    "/notes", "/formulas", "/videos", "/resources", "/bookmarks", "/search",
    "/profile", "/settings", "/cat-exam", "/strategy",
  ];
  return staticRoutes.map((r) => ({
    url: `${SITE_URL}${r}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.8,
  }));
}