import { SampleUnselectedProp } from "../../lib/interfaces/Editor";
import Sidebar from "./Sidebar";

export default function SampleUnselected({
  data,
}: {
  data: SampleUnselectedProp;
}) {
  const { samples, slug, title, description } = data;
  return (
    <section className="flex flex-col lg:flex-row w-full h-5/6 py-5 px-2 md:px-10 gap-3">
      <Sidebar data={samples} slug={slug} contributors={[]}></Sidebar>
      <div className="basis-4/5 flex flex-col justify-between bg-slate-100 lg:max-2xl:rounded-r-lg max-lg:rounded-b-lg overflow-scroll py-3">
        <section className="w-full font-mono font-semibold">
          <section className="flex h-8 justify-between bg-white py-1 px-4">
            <div id="title">{title}</div>
          </section>
          <article className="text-start text-gray-700" id="challenge">
            <p>{description}</p>
            <p>Select a sample to begin</p>
          </article>
        </section>
      </div>
    </section>
  );
}
