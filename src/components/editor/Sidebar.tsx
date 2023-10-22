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

function ShareButtons({ url, title }: { url: string; title: string }) {
  return (
    <div className="w-full bg-white py-2 px-4 my-5">
      <h4 className="mb-2 font-sans font-semibold">Share</h4>
      <div className="flex">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          target="_blank"
          rel="noopener"
        >
          <svg
            viewBox="0 0 524 524"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
          >
            <g clipPath="url(#clip0)">
              <path
                d="M262 524.037C406.699 524.037 524 406.735 524 262.037C524 117.338 406.699 0.03685 262 0.03685C117.301 0.03685 0 117.338 0 262.037C0 406.735 117.301 524.037 262 524.037Z"
                fill="#1977F3"
              ></path>
              <path
                d="M363.985 337.789L375.591 262.037H302.934V212.887C302.934 192.18 313.066 171.952 345.637 171.952H378.686V107.475C378.686 107.475 348.695 102.354 320.03 102.354C260.195 102.354 221.066 138.608 221.066 204.302V262.037H154.525V337.789H221.066V520.868C234.404 522.968 248.073 524.037 262 524.037C275.927 524.037 289.596 522.932 302.934 520.868V337.789H363.985Z"
                fill="white"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0">
                <rect width="524" height="524" fill="white"></rect>
              </clipPath>
            </defs>
          </svg>
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${title} - DevTyp.i.ng&amp;url=${url}&amp;hashtags=`}
          target="_blank"
          className="share-btn"
        >
          <svg
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
          >
            <path
              d="M200 400C310.457 400 400 310.457 400 200C400 89.5431 310.457 0 200 0C89.5431 0 0 89.5431 0 200C0 310.457 89.5431 400 200 400Z"
              fill="#1DA1F2"
            ></path>
            <path
              d="M163.4 305.5C252.1 305.5 300.6 232 300.6 168.3C300.6 166.2 300.6 164.1 300.5 162.1C309.9 155.3 318.1 146.8 324.6 137.1C316 140.9 306.7 143.5 296.9 144.7C306.9 138.7 314.5 129.3 318.1 118C308.8 123.5 298.5 127.5 287.5 129.7C278.7 120.3 266.2 114.5 252.3 114.5C225.7 114.5 204.1 136.1 204.1 162.7C204.1 166.5 204.5 170.2 205.4 173.7C165.3 171.7 129.8 152.5 106 123.3C101.9 130.4 99.5 138.7 99.5 147.5C99.5 164.2 108 179 121 187.6C113.1 187.4 105.7 185.2 99.2 181.6C99.2 181.8 99.2 182 99.2 182.2C99.2 205.6 115.8 225 137.9 229.5C133.9 230.6 129.6 231.2 125.2 231.2C122.1 231.2 119.1 230.9 116.1 230.3C122.2 249.5 140 263.4 161.1 263.8C144.6 276.7 123.8 284.4 101.2 284.4C97.3 284.4 93.5 284.2 89.7 283.7C110.8 297.5 136.2 305.5 163.4 305.5Z"
              fill="white"
            ></path>
          </svg>
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
          target="_blank"
          rel="noopener"
          className="share-btn"
        >
          <svg
            viewBox="0 0 535 534"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
          >
            <path
              d="M26.8 1.39999C16.3 5.19999 6.7 14.1 2.8 23.8L0.5 29.5V267V504.5L2.8 510.2C5.9 517.8 13.3 525.8 21.2 530.1L27.5 533.5H267.5H507.5L513.7 530.1C521.4 526 528.3 518.8 531.8 511.2L534.5 505.5V267V28.5L531.8 22.8C528.3 15.2 520.9 7.49999 513.5 3.59999L507.5 0.499992L269 0.299992C74.5 0.0999921 29.8 0.299992 26.8 1.39999ZM131.9 74.9C140.3 77.5 145.6 80.8 152.1 87.7C158.4 94.3 161 98.8 163.5 107.4C165.8 115.1 165.1 127.3 162.1 135.2C152.5 160.1 123.4 172 99.7 160.7C70.3 146.8 63.9 108.6 87.1 86C99 74.5 116.6 70.1 131.9 74.9ZM385.7 195.6C390.2 196.4 397.7 198.4 402.4 200.1C430.9 210.4 446.1 231.7 453.3 271.5C455.5 283.2 455.5 285.4 455.5 369.5V455.5H416H376.5L375.9 377.5C375.4 306.5 375.2 299 373.6 293.5C370.8 284.2 367 277.3 362.3 272.9C355.8 266.9 350.2 264.8 338.8 264.2C316.5 263.1 302.8 270 295 286.5C288.6 300.2 288.6 300 288 381.5L287.5 455.5H248H208.5L208.2 327.7L208 200H246.5H285V217.7V235.5L287.7 231.5C301.2 211.3 323.4 197.3 346.7 194.1C355.1 192.9 374.7 193.7 385.7 195.6ZM158.8 327.7L158.5 455.5H119H79.5L79.2 327.7L79 200H119H159L158.8 327.7Z"
              fill="#1666C5"
            ></path>
          </svg>
        </a>
        <span
          className="share-btn"
          title="Copy link"
          onClick={() => {
            navigator.clipboard.writeText(url).then(null);
          }}
        >
          <svg
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
          >
            <path
              d="M311 512H120C75.8867 512 40 476.113 40 432V161C40 116.887 75.8867 81 120 81H311C355.113 81 391 116.887 391 161V432C391 476.113 355.113 512 311 512ZM120 121C97.9453 121 80 138.945 80 161V432C80 454.055 97.9453 472 120 472H311C333.055 472 351 454.055 351 432V161C351 138.945 333.055 121 311 121H120ZM471 382V80C471 35.8867 435.113 0 391 0H169C157.953 0 149 8.95312 149 20C149 31.0469 157.953 40 169 40H391C413.055 40 431 57.9453 431 80V382C431 393.047 439.953 402 451 402C462.047 402 471 393.047 471 382Z"
              fill="currentColor"
            ></path>
          </svg>
        </span>{" "}
      </div>
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
          <ListSamples data={data} prefix={prefix} slug={slug} />
        )}

        {sampleSelected && data[0] && <ShowSummary data={data[0]} />}

        {sampleSelected && data[0] && (
          <ShareButtons
            url={`https://devtyp.i.ng/${prefix}/${slug}/${data[0].slug}`}
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
