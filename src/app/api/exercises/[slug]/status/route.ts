import { NextResponse } from "next/server";
import { requireAdminUser } from "../../../../../lib/server/firebase-auth";
import { toggleExerciseStatus } from "../../../../../lib/server/firestore-admin";

type StatusRouteContext = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, context: StatusRouteContext) {
  try {
    await requireAdminUser(request);

    const { slug } = await context.params;

    const { isActive } = await toggleExerciseStatus(slug);

    return NextResponse.json({ ok: true, isActive });
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
