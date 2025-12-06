import { redirect } from "next/navigation";
import SampleSelected from "../../components/editor/SampleSelected";
import SampleUnselected from "../../components/editor/SampleUnselected";

export default async function Editor({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const [topicSlug, exerciseSlug] = [slug[0], slug[1]];
  switch (slug.length) {
    case 1:
      return (
        <section className="flex flex-col lg:flex-row lg:h-full  w-full py-5 px-2 md:px-10 gap-3">
          <SampleUnselected prefix="" slug={topicSlug}></SampleUnselected>
        </section>
      );
    case 2:
      return (
        <section className="flex flex-col lg:flex-row lg:h-full  w-full py-5 px-2 md:px-10 gap-3">
          <SampleSelected
            prefix=""
            topicSlug={topicSlug}
            exerciseSlug={exerciseSlug}
          ></SampleSelected>
        </section>
      );
    default:
      redirect("/");
  }
}
