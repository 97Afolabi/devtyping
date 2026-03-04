import { FieldValue } from "firebase-admin/firestore";
import {
  adjustSpaces,
  generateExerciseSlug,
  generateSlug,
} from "../constants/strings";
import { adminDb } from "./firebase-admin";

interface CreateTopicInput {
  title: string;
  summary: string;
  description: string;
}

interface CreateExerciseInput {
  title: string;
  topicSlug: string;
  text: string;
  author: string;
}

export async function createTopic(input: CreateTopicInput): Promise<void> {
  const slug = generateSlug(input.title);
  const now = new Date();

  await adminDb.collection("topics").doc(slug).set(
    {
      slug,
      title: input.title,
      summary: input.summary,
      description: input.description,
      countActive: 0,
      countInactive: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    { merge: true },
  );
}

export async function createExercise(
  input: CreateExerciseInput,
): Promise<void> {
  const slug = generateExerciseSlug(input.title);
  const now = new Date();

  await adminDb.runTransaction(async (transaction) => {
    const topicRef = adminDb.collection("topics").doc(input.topicSlug);
    const topicSnap = await transaction.get(topicRef);
    if (!topicSnap.exists) {
      throw new Error("Topic not found");
    }

    const summaryRef = adminDb.collection("exercises").doc(slug);
    const detailRef = adminDb.collection("exercise_details").doc(slug);

    transaction.set(
      summaryRef,
      {
        slug,
        title: input.title,
        topicSlug: input.topicSlug,
        author: input.author,
        downVotes: 0,
        upVotes: 0,
        isActive: false,
        createdAt: now,
        updatedAt: now,
      },
      { merge: true },
    );

    transaction.set(
      detailRef,
      {
        slug,
        text: adjustSpaces(input.text),
      },
      { merge: true },
    );

    transaction.update(topicRef, {
      countInactive: FieldValue.increment(1),
      updatedAt: now,
    });
  });
}

export async function toggleExerciseStatus(slug: string): Promise<{
  isActive: boolean;
  topicSlug: string;
}> {
  return await adminDb.runTransaction(async (transaction) => {
    const exerciseRef = adminDb.collection("exercises").doc(slug);
    const exerciseSnap = await transaction.get(exerciseRef);

    if (!exerciseSnap.exists) {
      throw new Error("Exercise not found");
    }

    const exerciseData = exerciseSnap.data() as {
      isActive?: boolean;
      topicSlug?: string;
    };

    if (typeof exerciseData.isActive !== "boolean" || !exerciseData.topicSlug) {
      throw new Error("Invalid exercise state");
    }

    const nextActiveState = !exerciseData.isActive;
    const topicRef = adminDb.collection("topics").doc(exerciseData.topicSlug);

    transaction.update(exerciseRef, {
      isActive: nextActiveState,
      updatedAt: new Date(),
    });

    transaction.update(topicRef, {
      countActive: FieldValue.increment(nextActiveState ? 1 : -1),
      countInactive: FieldValue.increment(nextActiveState ? -1 : 1),
      updatedAt: new Date(),
    });

    return {
      isActive: nextActiveState,
      topicSlug: exerciseData.topicSlug,
    };
  });
}
