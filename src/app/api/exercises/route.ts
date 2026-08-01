import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "../../../lib/server/firebase-auth";
import { createExercise } from "../../../lib/server/firestore-admin";
import { ExercisePracticeLink } from "../../../lib/interfaces/Exercise";

interface CreateExerciseRequestBody {
  title?: string;
  topic?: string;
  text?: string;
  practiceLinks?: unknown;
}

const PRACTICE_LINK_PROVIDERS = new Set([
  "leetcode",
  "hackerrank",
  "codewars",
  "other",
]);
const MAX_PRACTICE_LINKS = 10;

function parsePracticeLinks(value: unknown): ExercisePracticeLink[] | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!Array.isArray(value) || value.length > MAX_PRACTICE_LINKS) {
    throw new Error(
      `practiceLinks must be an array of at most ${MAX_PRACTICE_LINKS} items`,
    );
  }

  return value.map((item, index) => {
    if (
      typeof item !== "object" ||
      item === null ||
      typeof (item as Record<string, unknown>).label !== "string" ||
      !(item as Record<string, string>).label.trim() ||
      typeof (item as Record<string, unknown>).url !== "string" ||
      !(item as Record<string, string>).url.trim() ||
      typeof (item as Record<string, unknown>).provider !== "string" ||
      !PRACTICE_LINK_PROVIDERS.has(
        (item as Record<string, string>).provider,
      ) ||
      typeof (item as Record<string, unknown>).free !== "boolean"
    ) {
      throw new Error(`practiceLinks[${index}] is invalid`);
    }

    return item as ExercisePracticeLink;
  });
}

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser(request);

    const body = (await request.json()) as CreateExerciseRequestBody;
    const title = body.title?.trim();
    const topic = body.topic?.trim();
    const text = body.text ?? "";

    if (!title || !topic || !text.trim()) {
      return NextResponse.json(
        { error: "Title, topic and text are required" },
        { status: 400 },
      );
    }

    let practiceLinks: ExercisePracticeLink[] | undefined;
    try {
      practiceLinks = parsePracticeLinks(body.practiceLinks);
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error ? error.message : "Invalid practiceLinks",
        },
        { status: 400 },
      );
    }

    await createExercise({
      title,
      topicSlug: topic,
      text,
      author: user.username,
      practiceLinks,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unable to save exercise";

    if (
      errorMessage.includes("authorization") ||
      errorMessage.includes("authentication") ||
      errorMessage.includes("authenticated")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Unable to save exercise" },
      { status: 500 },
    );
  }
}
