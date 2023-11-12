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
    <>
      <Sidebar
        data={samples}
        prefix={prefix}
        slug={slug}
        contributors={[]}
        sampleSelected={false}
      ></Sidebar>
      <div
        className="lg:basis-4/5 bg-slate-100 lg:max-2xl:rounded-r-lg max-lg:rounded-b-lg py-3"
        style={{ height: "85vh" }}
      >
        <section className="w-full font-mono font-semibold">
          <section className="h-8 bg-white py-1 px-4">
            <div>{title}</div>
          </section>
          <article className="text-center mx-5 my-5 whitespace-pre-line text-gray-700">
            <p className="text-sm mb-5">{description}</p>
            <p>Select a sample to begin</p>
          </article>
        </section>
      </div>
    </>
  );
}
