import Link from "next/link";
import { TopicSummary } from "../../lib/interfaces/TopicSummary";
import { getBgColor } from "../../lib/constants/bg-colors";

export default function SummaryCard({ data }: { data: TopicSummary }) {
  const { title, slug, summary, count } = data;
  const bgColor = getBgColor(slug);
  return (
    <div className={`p-4 rounded-md ${bgColor}`}>
      <strong className="text-2xl font-mono">{title}</strong>
      <span className="float-right bg-slate-900 text-white text-sm font-mono rounded-full px-1">
        {count}
      </span>
      <p className="text-sm font-mono">{summary}</p>
      <Link
        href={`e/${slug}`}
        className="float-right bg-slate-900 text-white text-sm font-mono rounded-full mt-2 py-2 px-4"
      >
        Start
      </Link>
    </div>
  );
}
