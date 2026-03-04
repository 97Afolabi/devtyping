import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "../../../lib/server/firebase-auth";
import { createExercise } from "../../../lib/server/firestore-admin";

interface CreateExerciseRequestBody {
  title?: string;
  topic?: string;
  text?: string;
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

    await createExercise({
      title,
      topicSlug: topic,
      text,
      author: user.username,
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
