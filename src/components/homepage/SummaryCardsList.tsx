"use client";
import dynamic from "next/dynamic";
import { TopicSummary } from "../../lib/interfaces/TopicSummary";

const SummaryCard = dynamic(() => import("./SummaryCard"), { ssr: false });

export default function SummaryCardsList({
  summaries,
}: {
  summaries: TopicSummary[];
}) {
  return (
    <section className="w-full grid md:grid-cols-3 md:content-start py-5 px-2 md:px-10 gap-y-5 gap-x-3">
      {summaries &&
        summaries.map((topic: TopicSummary) => (
          <SummaryCard prefix="" data={topic} key={topic.slug} />
        ))}
    </section>
  );
}
