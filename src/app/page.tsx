import fs from "fs";
import AnimatedTexts from "../components/homepage/AnimatedTexts";
import { CategorySummary } from "../lib/interfaces/CategorySummary";
import Summary from "../components/homepage/Summary";

async function fetchSummary() {
  try {
    // Read the JSON file from the root directory
    const data = fs.readFileSync("./languages/index.json", "utf-8");
    const jsonData = JSON.parse(data);
    // const response = await fetch("./languages/index.json");
    // const data = await response.json();
    return jsonData.list;
  } catch (error) {
    console.log(error);
  }
}

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
            <Summary data={language} key={language.id}></Summary>
          ))}
      </section>
    </>
  );
}
