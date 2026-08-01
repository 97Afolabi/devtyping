import { firestoreTopic } from "../lib/data/firebase/firestore/topics";
import AnimatedTexts from "../components/homepage/AnimatedTexts";
import SummaryCardsList from "../components/homepage/SummaryCardsList";

export default async function Home() {
  const summaries = await firestoreTopic.findAll();
  // Populated topics first; stable sort preserves original order within
  // each group.
  const sortedSummaries = [...summaries].sort(
    (a, b) => Number(b.countActive > 0) - Number(a.countActive > 0),
  );
  return (
    <div className="mt-6">
      <AnimatedTexts />
      <SummaryCardsList summaries={sortedSummaries} />
    </div>
  );
}
