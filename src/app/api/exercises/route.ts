import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "../../../lib/server/firebase-auth";
import { createExercise } from "../../../lib/server/firestore-admin";
import {
  ExercisePracticeLink,
  ExerciseSource,
} from "../../../lib/interfaces/Exercise";

interface CreateExerciseRequestBody {
  title?: string;
  topic?: string;
  text?: string;
  practiceLinks?: unknown;
  category?: unknown;
  difficulty?: unknown;
  source?: unknown;
}

const SOURCE_KINDS = new Set(["original", "derived", "verbatim"]);
const SOURCE_LICENSES = new Set([
  "MIT",
  "CC-BY-SA-4.0",
  "Apache-2.0",
  "original",
]);

function parseSource(value: unknown): ExerciseSource {
  if (typeof value !== "object" || value === null) {
    throw new Error("source is required");
  }

  const source = value as Record<string, unknown>;

  if (typeof source.kind !== "string" || !SOURCE_KINDS.has(source.kind)) {
    throw new Error("source.kind must be original, derived, or verbatim");
  }
  if (typeof source.origin !== "string" || !source.origin.trim()) {
    throw new Error("source.origin is required");
  }
  if (
    typeof source.license !== "string" ||
    !SOURCE_LICENSES.has(source.license)
  ) {
    throw new Error(
      "source.license must be MIT, CC-BY-SA-4.0, Apache-2.0, or original",
    );
  }
  if (
    source.license !== "original" &&
    (typeof source.attribution !== "string" || !source.attribution.trim())
  ) {
    throw new Error("source.attribution is required when license isn't original");
  }
  if (source.url !== undefined && typeof source.url !== "string") {
    throw new Error("source.url must be a string");
  }

  return {
    kind: source.kind as ExerciseSource["kind"],
    origin: source.origin.trim(),
    license: source.license as ExerciseSource["license"],
    ...(source.url ? { url: source.url as string } : {}),
    ...(source.attribution
      ? { attribution: source.attribution as string }
      : {}),
  };
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

    let source: ExerciseSource;
    let practiceLinks: ExercisePracticeLink[] | undefined;
    let category: string | undefined;
    let difficulty: 1 | 2 | 3 | undefined;
    try {
      source = parseSource(body.source);
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
      source,
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
