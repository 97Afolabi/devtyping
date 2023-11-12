"use client";
import { redirect } from "next/navigation";
import SampleSelected from "../../../components/editor/SampleSelected";
import SampleUnselected from "../../../components/editor/SampleUnselected";
import { isAuth } from "../../../components/IsAuth";

const Editor = ({ params }: { params: { slug: string } }) => {
  const [topicSlug, exerciseSlug] = [params.slug[0], params.slug[1]];
  switch (params.slug.length) {
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
};

export default isAuth(Editor);
