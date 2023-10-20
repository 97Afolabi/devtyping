import Link from "next/link";
import { ExerciseSummary } from "../../lib/data/firebase/exercises";

export default function Sidebar({
  data,
  prefix,
  slug,
  contributors,
  sampleSelected,
}: {
  data: ExerciseSummary[];
  prefix: "e" | "review";
  slug: string;
  contributors: string[];
  sampleSelected: boolean;
}) {
  let menuLink: string;
  let menuText: string;
  if (sampleSelected) {
    menuLink = `/${prefix}/${slug}`;
    menuText = "Back";
  } else {
    menuLink = prefix == "e" ? "/" : "/review";
    menuText = "Home";
  }
  return (
    <div className="basis-1/5 max-h-screen flex flex-col bg-slate-100 lg:max-2xl:rounded-l-lg max-lg:rounded-t-lg py-3 overflow-y-scroll">
      <Link
        href={menuLink}
        className="min-h-8 w-full bg-white py-1 px-4 mb-4 font-sans font-semibold"
      >
        {menuText}
      </Link>
      <section className="flex flex-col justify-between">
        <ul
          id="samples"
          className="list-inside list-image-[url('/icons/sample-icon.svg')] overflow-y-scroll px-3 font-sans text-slate-600"
        >
          {data &&
            data.map((list) => (
              <li
                key={list.slug}
                className="py-1 mb-1 border-b hover:font-semibold hover:bg-white"
              >
                <Link href={`/${prefix}/${slug}/${list.slug}`}>
                  {list.title}
                </Link>
              </li>
            ))}
        </ul>
        {contributors && contributors.length > 0 && (
          <div className="max-h-1/6 w-full bg-white py-2 px-4">Contributor</div>
        )}
      </section>
    </div>
  );
}
