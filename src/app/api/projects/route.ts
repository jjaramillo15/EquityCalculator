import { NextResponse } from "next/server";
import { createProject } from "@/lib/projects";

export async function POST(request: Request) {
  const payload = (await request.json()) as { name?: string };
  const name = payload.name?.trim();

  if (!name) {
    return NextResponse.json({ error: "Project name is required." }, { status: 400 });
  }

  const project = await createProject("demo-user", name);

  return NextResponse.json(project, { status: 201 });
}
