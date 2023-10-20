import { TopicSummary } from "../lib/interfaces/TopicSummary";
import { firestoreTopic } from "../lib/data/firebase/firestore/topics";
import AnimatedTexts from "../components/homepage/AnimatedTexts";
import SummaryCard from "../components/homepage/SummaryCard";

export default async function Home() {
  const summaries = await firestoreTopic.findAll();
  return (
    <>
      <AnimatedTexts />
      <section
        id="menu"
        className="w-full grid md:grid-cols-3 md:content-start py-5 px-2 md:px-10 gap-y-5 gap-x-3"
      >
        {summaries &&
          summaries.map((topic: TopicSummary) => (
            <SummaryCard prefix="e" data={topic} key={topic.slug}></SummaryCard>
          ))}
      </section>
    </>
  );
}
