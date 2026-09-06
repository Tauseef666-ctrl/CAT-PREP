import type { MetadataRoute } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cat-command.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/tests/*", "/learn/*"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}