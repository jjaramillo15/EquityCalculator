import { createShareLink } from "@/lib/shares";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ scenarioId: string }>;
};

export async function POST(_: Request, context: RouteContext) {
  const { scenarioId } = await context.params;
  const link = await createShareLink(scenarioId);

  return NextResponse.json(link, { status: 201 });
}
