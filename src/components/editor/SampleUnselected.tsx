"use client";
import { useEffect, useState } from "react";
import { topic } from "../../lib/data/data";
import { ExerciseSummary } from "../../lib/interfaces/Exercise";
import { SampleUnselectedProp } from "../../lib/interfaces/Editor";
import Sidebar from "./Sidebar";

export default function SampleUnselected({
  prefix,
  slug,
  initialData,
}: {
  prefix: "" | "review";
  slug: string;
  initialData?: SampleUnselectedProp | null;
}) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [samples, setSamples] = useState<ExerciseSummary[]>(
    initialData?.samples ?? [],
  );
  useEffect(() => {
    if (initialData) {
      // Server already fetched this via SSR — sync state from it (covers
      // client-side navigation between topics, where props change but this
      // component instance stays mounted) and warm IndexedDB from it
      // instead of re-fetching the same data over the network.
      handleTitleUpdate(initialData.title);
      handleDescriptionUpdate(initialData.description);
      handleSamplesUpdate(initialData.samples);
      topic.warmCache(initialData, prefix);
      return;
    }

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
  }, [prefix, slug, initialData]);

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
        <section className="w-full h-full overflow-y-scroll font-mono font-semibold">
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
