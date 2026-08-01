import { Timestamp } from "firebase-admin/firestore";
import { Exercise, ExerciseSummary } from "../interfaces/Exercise";
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

export async function getTopicSampleData(
  topicSlug: string,
): Promise<SampleUnselectedProp | null> {
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
}

export async function getActiveExerciseData(
  exerciseSlug: string,
): Promise<Exercise | null> {
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
}
