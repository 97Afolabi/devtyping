"use client";
import { useEffect, useState } from "react";
import { topic } from "../../lib/data/data";
import { ExerciseSummary } from "../../lib/interfaces/Exercise";
import Sidebar from "./Sidebar";

export default function SampleUnselected({
  prefix,
  slug,
}: {
  prefix: "e" | "review";
  slug: string;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [samples, setSamples] = useState<ExerciseSummary[]>([]);
  useEffect(() => {
    const getSamples = async () => {
      const data =
        prefix === "review"
          ? await topic.getInactiveExercises(slug)
          : await topic.getActiveExercises(slug);
      if (!data) {
        // TODO: show 404
      }
      handleTitleUpdate(data.title);
      handleDescriptionUpdate(data.description);
      handleSamplesUpdate(data.samples);
    };

    getSamples();
  }, [prefix, slug]);

  const handleTitleUpdate = (title: string) => {
    setTitle(title);
  };

  const handleDescriptionUpdate = (description: string) => {
    setDescription(description);
  };

  const handleSamplesUpdate = (samples: ExerciseSummary[]) => {
    setSamples(samples);
  };

  return (
    <section className="flex flex-col lg:flex-row w-full h-5/6 py-5 px-2 md:px-10 gap-3">
      <Sidebar
        data={samples}
        prefix={prefix}
        slug={slug}
        contributors={[]}
        sampleSelected={false}
      ></Sidebar>
      <div className="basis-4/5 flex flex-col justify-between bg-slate-100 lg:max-2xl:rounded-r-lg max-lg:rounded-b-lg overflow-scroll py-3">
        <section className="w-full font-mono font-semibold">
          <section className="flex h-8 justify-between bg-white py-1 px-4">
            <div>{title}</div>
          </section>
          <article className="flex flex-col items-center justify-center h-full mx-5 whitespace-pre-line text-gray-700">
            <p className="text-sm mb-5">{description}</p>
            <p>Select a sample to begin</p>
          </article>
        </section>
      </div>
    </section>
  );
}
