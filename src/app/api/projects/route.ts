import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { createProject } from "@/lib/projects";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const payload = (await request.json()) as { name?: string };
  const name = payload.name?.trim();

  if (!name) {
    return NextResponse.json({ error: "Project name is required." }, { status: 400 });
  }

  const project = await createProject(user.id, name);

  return NextResponse.json(project, { status: 201 });
}
