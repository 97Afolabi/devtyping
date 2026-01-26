"use client";
import { redirect, useParams } from "next/navigation";
import SampleSelected from "../../../components/editor/SampleSelected";
import SampleUnselected from "../../../components/editor/SampleUnselected";
import { isAuth } from "../../../components/IsAuth";

function Editor() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug : [params.slug];
  const [topicSlug, exerciseSlug] = [slug[0]!, slug[1]!];

  switch (slug.length) {
    case 1:
      return (
        <section className="flex flex-col lg:flex-row flex-1 w-full py-5 px-2 md:px-10 gap-3">
          <SampleUnselected prefix="review" slug={topicSlug}></SampleUnselected>
        </section>
      );
    case 2:
      return (
        <section className="flex flex-col lg:flex-row flex-1 w-full py-5 px-2 md:px-10 gap-3">
          <SampleSelected
            prefix="review"
            topicSlug={topicSlug}
            exerciseSlug={exerciseSlug}
          ></SampleSelected>
        </section>
      );
    default:
      redirect("/");
  }
}

export default isAuth(Editor);
