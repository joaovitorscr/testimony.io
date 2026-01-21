import type { MetadataRoute } from "next";
import { env } from "@/env";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = env.NEXT_PUBLIC_APP_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/account/",
          "/testimonies/",
          "/widget/",
          "/collect-link/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
