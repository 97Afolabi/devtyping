"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ExerciseSummary } from "../../lib/interfaces/Exercise";
import { firestoreExercise } from "../../lib/data/firebase/firestore/exercises";
import { IDBExercise } from "../../lib/data/indexeddb/indexeddb";

function ListSamples({
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

function ShowSummary({ data }: { data: ExerciseSummary }) {
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    const setStatus = async (isActive: boolean) => {
      setIsActive(isActive);
    };

    setStatus(data.isActive);
  }, [data.isActive]);

  const handleStatusUpdate = async (
    data: ExerciseSummary,
    isActive: boolean
  ) => {
    const status = isActive ? "active" : "inactive";
    await firestoreExercise.setStatus(data.slug!, status);
    await IDBExercise.set({
      ...data,
      isActive: !isActive,
      updatedAt: new Date().toISOString(),
    });
    setIsActive(!isActive);
  };

  return (
    <div className="mx-2">
      <p>
        <span className="mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="inline text-green-600"
          >
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
          </svg>{" "}
          ({data.upVotes})
        </span>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="inline text-red-600"
          >
            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
          </svg>{" "}
          ({data.downVotes})
        </span>
      </p>
      <p>
        <button
          type="button"
          className="bg-slate-600 hover:bg-slate-900 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
          onClick={() => handleStatusUpdate(data, isActive)}
        >
          {isActive ? "Deactivate" : "Activate"}
        </button>
      </p>
      <p>
        Date: {data.createdAt?.toLocaleDateString()}{" "}
        {data.createdAt?.toLocaleTimeString()}
      </p>
    </div>
  );
}

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
        {!sampleSelected && data.length > 0 && (
          <ListSamples data={data} prefix={prefix} slug={slug}></ListSamples>
        )}

        {sampleSelected && data[0] && (
          <ShowSummary data={data[0]}></ShowSummary>
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
