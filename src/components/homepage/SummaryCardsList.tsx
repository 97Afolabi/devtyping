"use client";
import { TopicSummary } from "../../lib/interfaces/TopicSummary";
import SummaryCard from "./SummaryCard";

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
