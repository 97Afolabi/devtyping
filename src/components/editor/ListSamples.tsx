import Link from "next/link";
import { ExerciseSummary } from "../../lib/interfaces/Exercise";

export default function ListSamples({
  data,
  prefix,
  slug,
}: {
  data: ExerciseSummary[];
  prefix: "e" | "review";
  slug: string;
}) {
  return (
    <ul
      id="samples"
      className="list-inside list-image-[url('/icons/sample-icon.svg')] overflow-y-scroll px-3 font-sans text-slate-600"
    >
      {data.map((list) => (
        <li
          key={list.slug}
          className="py-1 mb-1 border-b hover:font-semibold hover:bg-white"
        >
          <Link href={`/${prefix}/${slug}/${list.slug}`}>{list.title}</Link>
        </li>
      ))}
    </ul>
  );
}
