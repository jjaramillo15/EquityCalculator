import { NextResponse } from "next/server";
import { calculateEquity } from "@/lib/poker/equity-engine";
import { scenarioPayloadSchema } from "@/lib/validation/scenario";

export async function POST(request: Request) {
  const payload = scenarioPayloadSchema.parse(await request.json());
  const result = await calculateEquity({ ...payload, iterations: 1000 });

  return NextResponse.json(result);
}
