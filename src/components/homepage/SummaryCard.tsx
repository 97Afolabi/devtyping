"use client";
import Link from "next/link";
import { TopicSummary } from "../../lib/interfaces/TopicSummary";
import { getBgColor } from "../../lib/constants/bg-colors";

export default function SummaryCard({
  prefix,
  data,
}: {
  prefix: "" | "review";
  data: TopicSummary;
}) {
  const { title, slug, summary, countActive, countInactive } = data;
  const bgColor = getBgColor(slug);
  return (
    <div
      className={`flex flex-col justify-between p-4 rounded-md border-solid border-2 border-slate-900 bg-white ${bgColor}`}
    >
      <div>
        <strong className="text-2xl font-mono">{title}</strong>
        <span className="float-right bg-slate-900 text-white text-sm font-mono rounded-full px-1">
          {prefix ? countInactive : countActive}
        </span>
      </div>
      <p className="text-sm font-mono">{summary}</p>
      <div>
        <Link
          href={`${prefix}/${slug}`}
          className="float-right bg-slate-900 text-white text-sm font-mono rounded-full mt-2 py-2 px-4"
        >
          Start
        </Link>
      </div>
    </div>
  );
}
