import { NextResponse } from "next/server";
import { createSavedRange } from "@/lib/ranges";
import { rangePayloadSchema } from "@/lib/validation/range";

export async function POST(request: Request) {
  const payload = rangePayloadSchema.parse(await request.json());
  const range = await createSavedRange({
    ownerId: "demo-user",
    ...payload,
  });

  return NextResponse.json(range, { status: 201 });
}
