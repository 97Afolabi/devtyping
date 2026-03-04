"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import SampleSelected from "../../../components/editor/SampleSelected";
import SampleUnselected from "../../../components/editor/SampleUnselected";
import { isAuth } from "../../../components/IsAuth";

function Editor() {
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params.slug) ? params.slug : [params.slug];
  const [topicSlug, exerciseSlug] = [slug[0]!, slug[1]!];

  useEffect(() => {
    if (slug.length > 2) {
      router.replace("/");
    }
  }, [router, slug.length]);

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
      return null;
  }
}

export default isAuth(Editor);
