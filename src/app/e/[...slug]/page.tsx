import { redirect } from "next/navigation";
import SampleSelected from "../../../components/editor/SampleSelected";
import SampleUnselected from "../../../components/editor/SampleUnselected";

export default async function Editor({ params }: { params: { slug: string } }) {
  switch (params.slug.length) {
    case 1:
      return <SampleUnselected slug={params.slug[0]}></SampleUnselected>;
    case 2:
      return (
        <SampleSelected
          topicSlug={params.slug[0]}
          exerciseSlug={params.slug[1]}
        ></SampleSelected>
      );
    default:
      redirect("/");
  }
}
