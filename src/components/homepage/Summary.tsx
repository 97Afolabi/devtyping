import Link from "next/link";
import { CategorySummary } from "../../lib/interfaces/CategorySummary";
import { getBgColor } from "../../lib/constants/bg-colors";

export default function Summary({ data }: { data: CategorySummary }) {
  const { count, description, id, name } = data;
  const bgColor = getBgColor(id);
  return (
    <div className={`p-4 rounded-md bg-green-200 ${bgColor}`}>
      <strong className="text-2xl font-mono">{name}</strong>
      <span className="float-right bg-slate-900 text-white text-sm font-mono rounded-full px-1">
        {count}
      </span>
      <p className="text-sm font-mono">{description}</p>
      <Link
        href={`e/${id}`}
        className="float-right bg-slate-900 text-white text-sm font-mono rounded-full mt-2 py-2 px-4"
      >
        Start
      </Link>
    </div>
  );
}
