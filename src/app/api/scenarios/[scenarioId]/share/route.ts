import { createShareLink } from "@/lib/shares";
import { getCurrentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ scenarioId: string }>;
};

export async function POST(_: Request, context: RouteContext) {
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

  const link = await createShareLink(scenarioId);

  return NextResponse.json(link, { status: 201 });
}
