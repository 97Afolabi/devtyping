import dynamic from "next/dynamic";
import { firestoreTopic } from "../../lib/data/firebase/firestore/topics";
import { TopicSummary } from "../../lib/interfaces/TopicSummary";
import AnimatedTexts from "../../components/homepage/AnimatedTexts";
const SummaryCard = dynamic(
  () => import("../../components/homepage/SummaryCard"),
  {
    ssr: false,
  }
);

export default async function Review() {
  const summaries = await firestoreTopic.findAll();
  return (
    <>
      <AnimatedTexts />
      <section className="w-full grid md:grid-cols-3 md:content-start py-5 px-2 md:px-10 gap-y-5 gap-x-3">
        {summaries &&
          summaries.map((topic: TopicSummary) => (
            <SummaryCard
              prefix="review"
              data={topic}
              key={topic.slug}
            ></SummaryCard>
          ))}
      </section>
    </>
  );
}
