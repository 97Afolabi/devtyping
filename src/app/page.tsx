import { firestoreTopic } from "../lib/data/firebase/firestore/topics";
import AnimatedTexts from "../components/homepage/AnimatedTexts";
import SummaryCardsList from "../components/homepage/SummaryCardsList";

export default async function Home() {
  const summaries = await firestoreTopic.findAll();
  return (
    <div className="mt-6">
      <AnimatedTexts />
      <SummaryCardsList summaries={summaries} />
    </div>
  );
}
