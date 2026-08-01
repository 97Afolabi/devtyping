import { MetadataRoute } from "next";
import { getSitemapData } from "../lib/server/firestore-read";

const baseUrl = process.env.BASE_URL ?? "https://devtyp.i.ng";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const topics = await getSitemapData();

  const topicEntries: MetadataRoute.Sitemap = topics.map((topic) => ({
    url: `${baseUrl}/${topic.slug}`,
    changeFrequency: "weekly",
  }));

  const exerciseEntries: MetadataRoute.Sitemap = topics.flatMap((topic) =>
    topic.exerciseSlugs.map((exerciseSlug) => ({
      url: `${baseUrl}/${topic.slug}/${exerciseSlug}`,
      changeFrequency: "monthly" as const,
    })),
  );

  return [
    { url: baseUrl, changeFrequency: "weekly" },
    ...topicEntries,
    ...exerciseEntries,
  ];
}
