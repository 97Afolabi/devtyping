import { redirect } from "next/navigation";
import SampleSelected from "../../components/editor/SampleSelected";
import SampleUnselected from "../../components/editor/SampleUnselected";
import {
  getActiveExerciseData,
  getTopicSampleData,
} from "../../lib/server/firestore-read";

export default async function Editor({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const [topicSlug, exerciseSlug] = [slug[0], slug[1]];
  switch (slug.length) {
    case 1: {
      const initialData = await getTopicSampleData(topicSlug);
      return (
        <section className="flex flex-col lg:flex-row lg:h-full  w-full py-5 px-2 md:px-10 gap-3">
          <SampleUnselected
            prefix=""
            slug={topicSlug}
            initialData={initialData}
          ></SampleUnselected>
        </section>
      );
    }
    case 2: {
      const initialData = await getActiveExerciseData(exerciseSlug);
      return (
        <section className="flex flex-col lg:flex-row lg:h-full  w-full py-5 px-2 md:px-10 gap-3">
          <SampleSelected
            prefix=""
            topicSlug={topicSlug}
            exerciseSlug={exerciseSlug}
            initialData={initialData}
          ></SampleSelected>
        </section>
      );
    }
    default:
      redirect("/");
  }
}
