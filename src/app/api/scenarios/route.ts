import { NextResponse } from "next/server";
import { createScenario } from "@/lib/scenarios";
import { scenarioPayloadSchema } from "@/lib/validation/scenario";

export async function POST(request: Request) {
  const payload = scenarioPayloadSchema.parse(await request.json());
  const scenario = await createScenario({
    ownerId: "demo-user",
    ...payload,
  });

  return NextResponse.json(scenario, { status: 201 });
}
