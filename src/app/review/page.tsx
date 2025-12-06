import { firestoreTopic } from "../../lib/data/firebase/firestore/topics";
import AnimatedTexts from "../../components/homepage/AnimatedTexts";
import ReviewCardsList from "../../components/homepage/ReviewCardsList";

export default async function Review() {
  const summaries = await firestoreTopic.findAll();
  return (
    <>
      <AnimatedTexts />
      <ReviewCardsList summaries={summaries} />
    </>
  );
}
