import { Metadata } from "next";
import StaticPageLayout from "../../components/layouts/StaticPageLayout";

export const metadata: Metadata = {
  title: "Terms",
  description: "Usage terms for DevTyp.i.ng.",
};

export default function Terms() {
  return (
    <StaticPageLayout title="Terms">
      <p>
        DevTyp.i.ng is a free, community-built typing practice site. Use of
        the site means you accept these terms.
      </p>

      <h2 className="font-mono text-xl font-semibold pt-2">Using the site</h2>
      <p>
        The site is for personal practice. Use it as much as you like. Do
        not disrupt the service. Do not scrape the site at scale. Do not use
        the site to distribute malicious content.
      </p>

      <h2 className="font-mono text-xl font-semibold pt-2">Contributing</h2>
      <p>
        When you submit an exercise, you confirm that you have the right to
        share that code under the licence you declare. See{" "}
        <a
          href="https://github.com/97Afolabi/devtyping/blob/main/CONTRIBUTING.md"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          CONTRIBUTING.md
        </a>{" "}
        for the sourcing rules. We review submissions before we publish
        them. We may edit or remove a submission at any time.
      </p>

      <h2 className="font-mono text-xl font-semibold pt-2">
        Licence and disclaimer
      </h2>
      <p>
        The DevTyp.i.ng codebase uses the MIT licence. See the{" "}
        <a
          href="https://github.com/97Afolabi/devtyping/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          LICENSE
        </a>{" "}
        file. Each exercise carries its own content licence. See the{" "}
        <a href="/attribution" className="underline">
          Attribution
        </a>{" "}
        page for the full list.
      </p>
      <p>
        The site and its content are provided as is, with no warranty of
        any kind, express or implied. We are not liable for damages that
        result from use of the site.
      </p>

      <h2 className="font-mono text-xl font-semibold pt-2">
        Third-party links
      </h2>
      <p>
        Practice links point to third-party problem sites, such as LeetCode,
        HackerRank, and Codewars. We do not control or endorse that content,
        and we are not responsible for it. A link does not imply affiliation
        with that platform.
      </p>

      <h2 className="font-mono text-xl font-semibold pt-2">Changes</h2>
      <p>
        These terms may change as the site develops. If you continue to use
        the site after a change, you accept the updated terms.
      </p>
    </StaticPageLayout>
  );
}
