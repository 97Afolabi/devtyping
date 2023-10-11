import { SampleSelectedProp } from "../../lib/interfaces/Editor";
import Sidebar from "./Sidebar";
import Timer from "./Timer";

export default function SampleSelected({ data }: { data: SampleSelectedProp }) {
  const { text, title, contributors, slug } = data;
  return (
    <section className="flex flex-col lg:flex-row w-full h-5/6 py-5 px-2 md:px-10 gap-3">
      <Sidebar data={[]} slug={slug} contributors={contributors}></Sidebar>
      <div className="basis-4/5 flex flex-col justify-between bg-slate-100 lg:max-2xl:rounded-r-lg max-lg:rounded-b-lg overflow-scroll py-3">
        <section className="w-full font-mono font-semibold">
          <section className="flex h-8 justify-between bg-white py-1 px-4">
            <div id="title">{title}</div>
            <Timer></Timer>
          </section>
          <pre>
            <code className="text-start text-gray-700" id="challenge">
              {text}
            </code>
          </pre>
        </section>
        <section className="flex justify-center w-full bg-white py-2 px-4">
          <textarea
            className="basis-11/12 rounded-l-lg border-dashed border-2 px-2 py-2 text-start"
            placeholder="Start typing..."
          ></textarea>
          <button className="basis-1/12 bg-slate-800 rounded-r-lg text-white">
            Copy
          </button>
        </section>
      </div>
    </section>
  );
}
