import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scenarioPayloadSchema } from "@/lib/validation/scenario";

type RouteContext = {
  params: Promise<{ scenarioId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { scenarioId } = await context.params;
  const payload = scenarioPayloadSchema.parse(await request.json());

  const scenario = await db.scenario.update({
    where: { id: scenarioId },
    data: payload,
  });

  return NextResponse.json(scenario);
}

export async function DELETE(_: Request, context: RouteContext) {
  const { scenarioId } = await context.params;

  await db.scenario.delete({
    where: { id: scenarioId },
  });

  return new NextResponse(null, { status: 204 });
}
