import { MetadataRoute } from "next";

const baseUrl = process.env.BASE_URL ?? "https://devtyp.i.ng";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/review",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
