import { redirect } from "next/navigation";
import { fetchSample, fetchSamples } from "../../../lib/database/read-queries";
import SampleSelected from "../../../components/editor/SampleSelected";
import SampleUnselected from "../../../components/editor/SampleUnselected";

export default async function Editor({ params }: { params: { slug: string } }) {
  switch (params.slug.length) {
    case 1:
      const data = await fetchSamples(params.slug[0]);
      const values = {
        samples: data.samples,
        slug: params.slug[0],
        title: data.title,
        description: data.description,
      };
      return <SampleUnselected data={values}></SampleUnselected>;
    case 2:
      const sample = await fetchSample(params.slug[0], params.slug[1]);
      if (!sample) {
        redirect(`/e/${params.slug[0]}`);
      }
      sample.slug = params.slug[0];
      return sample && <SampleSelected data={sample}></SampleSelected>;
    default:
      redirect("/");
  }
}
