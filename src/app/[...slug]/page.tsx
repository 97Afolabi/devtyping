import { Metadata } from "next";
import { redirect } from "next/navigation";
import SampleSelected from "../../components/editor/SampleSelected";
import SampleUnselected from "../../components/editor/SampleUnselected";
import {
  getActiveExerciseData,
  getTopicSampleData,
} from "../../lib/server/firestore-read";
import { truncateDescription } from "../../lib/constants/strings";

const baseUrl = process.env.BASE_URL ?? "https://devtyp.i.ng";

type PageParams = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const [topicSlug, exerciseSlug] = [slug[0], slug[1]];

  if (slug.length === 1) {
    const data = await getTopicSampleData(topicSlug);
    if (!data) {
      return {};
    }

    const title = `${data.title} typing exercises`;
    const description = truncateDescription(
      data.description ||
        `Practice ${data.title} with real-world typing exercises on DevTyp.i.ng.`,
    );
    const url = `${baseUrl}/${topicSlug}`;

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        type: "website",
        images: ["/opengraph-image"],
      },
    };
  }

  if (slug.length === 2) {
    const data = await getActiveExerciseData(exerciseSlug);
    if (!data) {
      return {};
    }

    const title = `${data.title} in ${data.topicSlug} — typing practice`;
    const description = truncateDescription(
      `Practice typing "${data.title}"${
        data.category ? ` (${data.category})` : ""
      } — a ${data.topicSlug} exercise on DevTyp.i.ng.`,
    );
    const url = `${baseUrl}/${topicSlug}/${exerciseSlug}`;

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        type: "website",
        images: ["/opengraph-image"],
      },
    };
  }

  return {};
}

function BreadcrumbJsonLd({
  topicSlug,
  exerciseSlug,
  exerciseTitle,
}: {
  topicSlug: string;
  exerciseSlug: string;
  exerciseTitle: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: topicSlug,
        item: `${baseUrl}/${topicSlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: exerciseTitle,
        item: `${baseUrl}/${topicSlug}/${exerciseSlug}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function Editor({ params }: PageParams) {
  const { slug } = await params;
  const [topicSlug, exerciseSlug] = [slug[0], slug[1]];
  switch (slug.length) {
    case 1: {
      const initialData = await getTopicSampleData(topicSlug);
      return (
        <section className="flex flex-col lg:flex-row lg:h-full  w-full py-5 px-2 md:px-10 gap-3">
          <SampleUnselected
            prefix=""
            slug={topicSlug}
            initialData={initialData}
          ></SampleUnselected>
        </section>
      );
    }
    case 2: {
      const initialData = await getActiveExerciseData(exerciseSlug);
      return (
        <section className="flex flex-col lg:flex-row lg:h-full  w-full py-5 px-2 md:px-10 gap-3">
          {initialData && (
            <BreadcrumbJsonLd
              topicSlug={topicSlug}
              exerciseSlug={exerciseSlug}
              exerciseTitle={initialData.title}
            />
          )}
          <SampleSelected
            prefix=""
            topicSlug={topicSlug}
            exerciseSlug={exerciseSlug}
            initialData={initialData}
          ></SampleSelected>
        </section>
      );
    }
    default:
      redirect("/");
  }
}
