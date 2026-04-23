import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { createSavedRange } from "@/lib/ranges";
import { rangePayloadSchema } from "@/lib/validation/range";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const payload = rangePayloadSchema.parse(await request.json());
  const range = await createSavedRange({
    ownerId: user.id,
    ...payload,
  });

  return NextResponse.json(range, { status: 201 });
}
