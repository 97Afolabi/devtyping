import { NextResponse } from "next/server";
import { firestoreExercise } from "../../../../../lib/data/firebase/firestore/exercises";
import { firestoreTopic } from "../../../../../lib/data/firebase/firestore/topics";
import { requireAdminUser } from "../../../../../lib/server/firebase-auth";

interface UpdateExerciseStatusRequestBody {
  isActive?: boolean;
  topicSlug?: string;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    await requireAdminUser(request);

    const { slug } = await context.params;
    const body = (await request.json()) as UpdateExerciseStatusRequestBody;

    if (typeof body.isActive !== "boolean" || !body.topicSlug) {
      return NextResponse.json(
        { error: "isActive and topicSlug are required" },
        { status: 400 },
      );
    }

    const nextActiveState = !body.isActive;
    await firestoreExercise.setStatus(slug, nextActiveState);

    await firestoreTopic.updateCount(
      body.topicSlug,
      body.isActive ? "deactivate" : "activate",
    );

    return NextResponse.json({ ok: true, isActive: nextActiveState });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unable to update status";

    if (errorMessage === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (
      errorMessage.includes("authorization") ||
      errorMessage.includes("authentication") ||
      errorMessage.includes("authenticated")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Unable to update status" },
      { status: 500 },
    );
  }
}
