import { Metadata } from "next";
import StaticPageLayout from "../../components/layouts/StaticPageLayout";
import { getNonOriginalExercises } from "../../lib/server/firestore-read";

export const metadata: Metadata = {
  title: "Attribution",
  description:
    "Every non-original exercise on DevTyp.i.ng, with its licence and upstream source.",
};

export default async function Attribution() {
  const entries = await getNonOriginalExercises();

  return (
    <StaticPageLayout title="Attribution">
      <p>
        Every exercise on DevTyp.i.ng has a declared source and licence. See{" "}
        <a
          href="https://github.com/97Afolabi/devtyping/blob/main/CONTRIBUTING.md"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          CONTRIBUTING.md
        </a>{" "}
        for the sourcing policy. This page lists all content that is not
        original work. This includes work derived from, or copied
        verbatim from, a permissively licensed upstream source, with
        attribution.
      </p>

      {entries.length === 0 ? (
        <p>
          Nothing to list yet. Every published exercise is currently marked
          as original.
        </p>
      ) : (
        <table className="w-full text-sm border-collapse mt-4">
          <thead>
            <tr className="text-left border-b border-gray-400">
              <th className="py-2 pr-2">Exercise</th>
              <th className="py-2 pr-2">Licence</th>
              <th className="py-2 pr-2">Origin</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.slug} className="border-b border-gray-200">
                <td className="py-2 pr-2">
                  <a
                    href={`/${entry.topicSlug}/${entry.slug}`}
                    className="underline"
                  >
                    {entry.title}
                  </a>
                </td>
                <td className="py-2 pr-2">{entry.source.license}</td>
                <td className="py-2 pr-2">
                  {entry.source.url ? (
                    <a
                      href={entry.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {entry.source.origin}
                    </a>
                  ) : (
                    entry.source.origin
                  )}
                  {entry.source.attribution && (
                    <div className="text-gray-500 text-xs mt-1">
                      {entry.source.attribution}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </StaticPageLayout>
  );
}
