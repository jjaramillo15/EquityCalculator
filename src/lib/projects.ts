import { db } from "@/lib/db";

export async function createProject(ownerId: string, name: string) {
  return db.project.create({
    data: {
      ownerId,
      name,
    },
  });
}
