import Link from "next/link";
import { SidebarItems } from "../../lib/interfaces/Sidebar";

export default function Sidebar({
  data,
  slug,
  contributors,
}: {
  data: SidebarItems[];
  slug: string;
  contributors: string[];
}) {
  let menuLink: string;
  let menuText: string;
  if (contributors && contributors.length) {
    menuLink = slug;
    menuText = "Back";
  } else {
    menuLink = "/";
    menuText = "Home";
  }
  return (
    <div className="basis-1/5 flex flex-col bg-slate-100 lg:max-2xl:rounded-l-lg max-lg:rounded-t-lg py-3 overflow-y-auto">
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
                key={list.url}
                className="py-1 mb-1 border-b hover:font-semibold hover:bg-white"
              >
                <Link href={`/e/${slug}/${list.url}`}>{list.title}</Link>
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
