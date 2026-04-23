import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { scenarioPayloadSchema } from "@/lib/validation/scenario";

type RouteContext = {
  params: Promise<{ scenarioId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { scenarioId } = await context.params;
  const payload = scenarioPayloadSchema.parse(await request.json());
  const existingScenario = await db.scenario.findFirst({
    where: {
      id: scenarioId,
      ownerId: user.id,
    },
    select: { id: true },
  });

  if (!existingScenario) {
    return NextResponse.json({ error: "Scenario not found." }, { status: 404 });
  }

  const scenario = await db.scenario.update({
    where: { id: scenarioId },
    data: payload,
  });

  return NextResponse.json(scenario);
}

export async function DELETE(_: Request, context: RouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { scenarioId } = await context.params;
  const existingScenario = await db.scenario.findFirst({
    where: {
      id: scenarioId,
      ownerId: user.id,
    },
    select: { id: true },
  });

  if (!existingScenario) {
    return NextResponse.json({ error: "Scenario not found." }, { status: 404 });
  }

  await db.scenario.delete({
    where: { id: scenarioId },
  });

  return new NextResponse(null, { status: 204 });
}
