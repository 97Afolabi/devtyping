import { redirect } from "next/navigation";
import SampleSelected from "../../../components/editor/SampleSelected";
import SampleUnselected from "../../../components/editor/SampleUnselected";

export default function Editor({ params }: { params: { slug: string } }) {
  const [topicSlug, exerciseSlug] = [params.slug[0], params.slug[1]];
  switch (params.slug.length) {
    case 1:
      return <SampleUnselected prefix="e" slug={topicSlug}></SampleUnselected>;
    case 2:
      return (
        <SampleSelected
          prefix="e"
          topicSlug={topicSlug}
          exerciseSlug={exerciseSlug}
        ></SampleSelected>
      );
    default:
      redirect("/");
  }
}
