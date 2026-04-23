import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseRangeText } from "@/lib/poker/range-parser";
import { rangePayloadSchema } from "@/lib/validation/range";

type RouteContext = {
  params: Promise<{ rangeId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { rangeId } = await context.params;
  const payload = rangePayloadSchema.parse(await request.json());

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
  const { rangeId } = await context.params;

  await db.savedRange.delete({
    where: { id: rangeId },
  });

  return new NextResponse(null, { status: 204 });
}
