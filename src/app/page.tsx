import { firestoreTopic } from "../lib/data/firebase/firestore/topics";
import AnimatedTexts from "../components/homepage/AnimatedTexts";
import SummaryCardsList from "../components/homepage/SummaryCardsList";

const baseUrl = process.env.BASE_URL ?? "https://devtyp.i.ng";
const siteName = process.env.SITE_NAME ?? "DevTyp.i.ng";

function WebApplicationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteName,
    url: baseUrl,
    description: "Improvement through repetition",
    applicationCategory: "EducationalApplication",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function Home() {
  const summaries = await firestoreTopic.findAll();
  // Populated topics first; stable sort preserves original order within
  // each group.
  const sortedSummaries = [...summaries].sort(
    (a, b) => Number(b.countActive > 0) - Number(a.countActive > 0),
  );
  return (
    <div className="mt-6">
      <WebApplicationJsonLd />
      <AnimatedTexts />
      <SummaryCardsList summaries={sortedSummaries} />
    </div>
  );
}
