import { CategorySummary } from "../lib/interfaces/CategorySummary";
import { fetchSummary } from "../lib/database/read-queries";
import AnimatedTexts from "../components/homepage/AnimatedTexts";
import SummaryCard from "../components/homepage/SummaryCard";

export default async function Home() {
  const summaries = await fetchSummary();
  return (
    <>
      <AnimatedTexts />
      <section
        id="menu"
        className="w-full grid md:grid-cols-3 md:content-start py-5 px-2 md:px-10 gap-y-5 gap-x-3"
      >
        {summaries &&
          summaries.map((language: CategorySummary) => (
            <SummaryCard data={language} key={language.id}></SummaryCard>
          ))}
      </section>
    </>
  );
}
