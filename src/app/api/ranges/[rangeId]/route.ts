import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { parseRangeText } from "@/lib/poker/range-parser";
import { rangePayloadSchema } from "@/lib/validation/range";

type RouteContext = {
  params: Promise<{ rangeId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { rangeId } = await context.params;
  const payload = rangePayloadSchema.parse(await request.json());
  const existingRange = await db.savedRange.findFirst({
    where: {
      id: rangeId,
      ownerId: user.id,
    },
    select: { id: true },
  });

  if (!existingRange) {
    return NextResponse.json({ error: "Range not found." }, { status: 404 });
  }

  const range = await db.savedRange.update({
    where: { id: rangeId },
    data: {
      ...payload,
      canonicalRange: parseRangeText(payload.textValue),
    },
  });

  return NextResponse.json(range);
}

export async function DELETE(_: Request, context: RouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { rangeId } = await context.params;
  const existingRange = await db.savedRange.findFirst({
    where: {
      id: rangeId,
      ownerId: user.id,
    },
    select: { id: true },
  });

  if (!existingRange) {
    return NextResponse.json({ error: "Range not found." }, { status: 404 });
  }

  await db.savedRange.delete({
    where: { id: rangeId },
  });

  return new NextResponse(null, { status: 204 });
}
