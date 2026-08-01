import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "../../../lib/server/firebase-auth";
import { createExercise } from "../../../lib/server/firestore-admin";
import { ExercisePracticeLink } from "../../../lib/interfaces/Exercise";

interface CreateExerciseRequestBody {
  title?: string;
  topic?: string;
  text?: string;
  practiceLinks?: unknown;
  category?: unknown;
  difficulty?: unknown;
}

const VALID_DIFFICULTIES = new Set([1, 2, 3]);

function parseCategory(value: unknown): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("category must be a non-empty string");
  }
  return value.trim();
}

function parseDifficulty(value: unknown): 1 | 2 | 3 | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "number" || !VALID_DIFFICULTIES.has(value)) {
    throw new Error("difficulty must be 1, 2, or 3");
  }
  return value as 1 | 2 | 3;
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
    let category: string | undefined;
    let difficulty: 1 | 2 | 3 | undefined;
    try {
      practiceLinks = parsePracticeLinks(body.practiceLinks);
      category = parseCategory(body.category);
      difficulty = parseDifficulty(body.difficulty);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Invalid input" },
        { status: 400 },
      );
    }

    await createExercise({
      title,
      topicSlug: topic,
      text,
      author: user.username,
      practiceLinks,
      category,
      difficulty,
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
