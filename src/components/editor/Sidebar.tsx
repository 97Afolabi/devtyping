"use client";
import Link from "next/link";
import { ExerciseSummary } from "../../lib/interfaces/Exercise";
import { getAuthUser } from "../../lib/data/auth";
import ListSamples from "./ListSamples";
import ShareButtons from "./ShareButtons";
import ShowSummary from "./ShowSummary";

export default function Sidebar({
  data,
  prefix,
  slug,
  contributors,
  sampleSelected,
}: {
  data: ExerciseSummary[];
  prefix: "" | "review";
  slug: string;
  contributors: string[];
  sampleSelected: boolean;
}) {
  let menuLink: string;
  let menuText: string;
  if (sampleSelected) {
    menuLink = prefix ? `/${prefix}/${slug}` : `/${slug}`;
    menuText = "Back";
  } else {
    menuLink = prefix ? "/review" : "/";
    menuText = "Home";
  }
  const auth = getAuthUser();

  return (
    <div
      className="basis-1/5 flex flex-col bg-slate-100 lg:max-2xl:rounded-l-lg max-lg:rounded-t-lg py-3 overflow-y-scroll"
      style={{ height: "85vh" }}
    >
      <Link
        href={menuLink}
        className="min-h-8 w-full bg-white py-1 px-4 mb-4 font-sans font-semibold"
      >
        {menuText}
      </Link>
      <section className="flex flex-col justify-between">
        {!sampleSelected && data.length > 0 && (
          <ListSamples data={data} prefix={prefix} slug={slug} />
        )}

        {auth && auth.username && sampleSelected && data[0] && (
          <ShowSummary data={data[0]} />
        )}

        {sampleSelected && data[0] && (
          <ShareButtons
            url={
              prefix
                ? `https://devtyp.i.ng/${prefix}/${slug}/${data[0].slug}`
                : `https://devtyp.i.ng/${slug}/${data[0].slug}`
            }
            title={data[0].title}
          />
        )}

        {contributors && contributors.length > 0 && (
          <div className="max-h-1/6 w-full bg-white py-2 px-4">
            <h4 className="mb-2 font-sans font-semibold">Contributors</h4>
            <p>
              {contributors.map((user) => (
                <a
                  href={`https://github.com/${user}`}
                  target="_blank"
                  className="pr-2 underline"
                  key={user}
                >
                  {user}
                </a>
              ))}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
