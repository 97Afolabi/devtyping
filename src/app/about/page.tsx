import { Metadata } from "next";
import StaticPageLayout from "../../components/layouts/StaticPageLayout";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who built DevTyp.i.ng and why. A typing practice site built on real-world code.",
};

export default function About() {
  return (
    <StaticPageLayout title="About">
      <p>DevTyp.i.ng is a touch-typing practice site.</p>
      <p>
        Most typing practice sites use prose or random characters. This site
        uses real code instead. You type the syntax and structure that
        developers use every day, across many languages and frameworks.
      </p>
      <p>
        The project is open source and uses the MIT licence. The community
        contributes exercises. Each exercise carries a record of its source and
        licence. See the{" "}
        <a href="/attribution" className="underline">
          Attribution
        </a>{" "}
        page for the full list of non-original content and its source.
      </p>
      <p>
        The code is on{" "}
        <a
          href="https://github.com/97Afolabi/devtyping"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          GitHub
        </a>
        . Contributions, bug reports, and exercise submissions are welcome. See
        the{" "}
        <a
          href="https://github.com/97Afolabi/devtyping/blob/main/CONTRIBUTING.md"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          CONTRIBUTING.md
        </a>{" "}
        file in the repository, or use the{" "}
        <a href="/contribute" className="underline">
          in-app contribute form
        </a>
        .
      </p>
    </StaticPageLayout>
  );
}
