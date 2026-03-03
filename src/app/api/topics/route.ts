import { NextResponse } from "next/server";
import { firestoreTopic } from "../../../lib/data/firebase/firestore/topics";
import { requireAdminUser } from "../../../lib/server/firebase-auth";

interface CreateTopicRequestBody {
  title?: string;
  summary?: string;
  description?: string;
}

export async function POST(request: Request) {
  try {
    await requireAdminUser(request);

    const body = (await request.json()) as CreateTopicRequestBody;
    const title = body.title?.trim();
    const summary = body.summary?.trim();
    const description = body.description?.trim();

    if (!title) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    await firestoreTopic.save({
      title,
      summary: summary ?? "",
      description: description ?? "",
      countActive: 0,
      countInactive: 0,
      isActive: true,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unable to create topic";

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
      { error: "Unable to create topic" },
      { status: 500 },
    );
  }
}
