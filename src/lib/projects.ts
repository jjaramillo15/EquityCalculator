import { db } from "@/lib/db";
import { ensureDemoUser } from "@/lib/workspace";

export async function createProject(ownerId: string, name: string) {
  if (ownerId === "demo-user") {
    await ensureDemoUser();
  }

  return db.project.create({
    data: {
      ownerId,
      name,
    },
  });
}
