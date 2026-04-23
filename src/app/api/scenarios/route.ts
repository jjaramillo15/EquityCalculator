import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { createScenario } from "@/lib/scenarios";
import { scenarioPayloadSchema } from "@/lib/validation/scenario";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const payload = scenarioPayloadSchema.parse(await request.json());
  const scenario = await createScenario({
    ownerId: user.id,
    ...payload,
  });

  return NextResponse.json(scenario, { status: 201 });
}
