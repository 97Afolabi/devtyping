import { cache } from "react";
import { Timestamp } from "firebase-admin/firestore";
import {
  Exercise,
  ExerciseSource,
  ExerciseSummary,
} from "../interfaces/Exercise";
import { SampleUnselectedProp } from "../interfaces/Editor";
import { adminDb } from "./firebase-admin";

// Server Components can only pass plain objects and a few built-ins (Date,
// Map, Set, ...) to Client Components. Firestore's Timestamp class isn't one
// of them, so it has to be converted before it crosses that boundary.
function toDate(value: unknown): Date | undefined {
  return value instanceof Timestamp ? value.toDate() : undefined;
}

function toExerciseSummary(
  id: string,
  data: FirebaseFirestore.DocumentData,
): ExerciseSummary {
  return {
    id,
    slug: data.slug ?? id,
    title: data.title,
    topicSlug: data.topicSlug,
    author: data.author,
    downVotes: data.downVotes,
    upVotes: data.upVotes,
    isActive: data.isActive,
    source: data.source,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

// Wrapped in React's cache() so generateMetadata() and the page component
// share a single Firestore read per request instead of fetching twice.
export const getTopicSampleData = cache(async function getTopicSampleData(
  topicSlug: string,
): Promise<SampleUnselectedProp | null> {
  try {
    const topicSnap = await adminDb.collection("topics").doc(topicSlug).get();
    if (!topicSnap.exists) {
      return null;
    }

    const topicData = topicSnap.data() as FirebaseFirestore.DocumentData;

    const exercisesSnap = await adminDb
      .collection("exercises")
      .where("topicSlug", "==", topicSlug)
      .where("isActive", "==", true)
      .get();

    const samples = exercisesSnap.docs.map((doc) =>
      toExerciseSummary(doc.id, doc.data()),
    );

    return {
      title: topicData.title,
      slug: topicSlug,
      description: topicData.description,
      samples,
    };
  } catch (error) {
    // SSR is a progressive enhancement here: if the Admin SDK can't reach
    // Firestore (e.g. missing/invalid credentials), fall back to null so
    // the client component's own client-side fetch takes over instead of
    // crashing the page render.
    console.error("getTopicSampleData failed, falling back client-side", error);
    return null;
  }
});

// Wrapped in React's cache() — see getTopicSampleData above.
export const getActiveExerciseData = cache(async function getActiveExerciseData(
  exerciseSlug: string,
): Promise<Exercise | null> {
  try {
    const [summarySnap, detailSnap] = await Promise.all([
      adminDb.collection("exercises").doc(exerciseSlug).get(),
      adminDb.collection("exercise_details").doc(exerciseSlug).get(),
    ]);

    if (
      !summarySnap.exists ||
      !detailSnap.exists ||
      summarySnap.data()?.isActive !== true
    ) {
      return null;
    }

    const summary = toExerciseSummary(
      summarySnap.id,
      summarySnap.data() as FirebaseFirestore.DocumentData,
    );
    const detailData = detailSnap.data() as FirebaseFirestore.DocumentData;

    return {
      ...summary,
      slug: detailData.slug ?? summary.slug,
      prerequisite: detailData.prerequisite,
      contributors: detailData.contributors,
      text: detailData.text,
      practiceLinks: detailData.practiceLinks,
      category: detailData.category,
      lineCount: detailData.lineCount,
      difficulty: detailData.difficulty,
    };
  } catch (error) {
    // Same fallback rationale as getTopicSampleData above.
    console.error(
      "getActiveExerciseData failed, falling back client-side",
      error,
    );
    return null;
  }
});

export interface SitemapTopic {
  slug: string;
  exerciseSlugs: string[];
}

// Topics with zero active exercises are excluded — the spec is explicit
// that empty topics shouldn't be listed in the sitemap until they have
// content (matches the "Coming soon" treatment on the homepage).
export async function getSitemapData(): Promise<SitemapTopic[]> {
  try {
    const [topicsSnap, exercisesSnap] = await Promise.all([
      adminDb.collection("topics").get(),
      adminDb.collection("exercises").where("isActive", "==", true).get(),
    ]);

    const exerciseSlugsByTopic = new Map<string, string[]>();
    for (const doc of exercisesSnap.docs) {
      const data = doc.data();
      const slugs = exerciseSlugsByTopic.get(data.topicSlug) ?? [];
      slugs.push(data.slug ?? doc.id);
      exerciseSlugsByTopic.set(data.topicSlug, slugs);
    }

    return topicsSnap.docs
      .map((doc) => ({
        slug: doc.id,
        exerciseSlugs: exerciseSlugsByTopic.get(doc.id) ?? [],
      }))
      .filter((topic) => topic.exerciseSlugs.length > 0);
  } catch (error) {
    console.error(
      "getSitemapData failed, sitemap will only list the homepage",
      error,
    );
    return [];
  }
}

export interface AttributionEntry {
  slug: string;
  title: string;
  topicSlug: string;
  source: ExerciseSource;
}

export async function getNonOriginalExercises(): Promise<AttributionEntry[]> {
  try {
    const snap = await adminDb
      .collection("exercises")
      .where("isActive", "==", true)
      .get();

    return snap.docs
      .map((doc) => {
        const data = doc.data();
        return {
          slug: data.slug ?? doc.id,
          title: data.title,
          topicSlug: data.topicSlug,
          source: data.source as ExerciseSource | undefined,
        };
      })
      .filter(
        (entry): entry is AttributionEntry =>
          !!entry.source && entry.source.kind !== "original",
      );
  } catch (error) {
    console.error(
      "getNonOriginalExercises failed, attribution page will show none",
      error,
    );
    return [];
  }
}
