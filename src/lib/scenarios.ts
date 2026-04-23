import { db } from "@/lib/db";
import { ensureDemoUser } from "@/lib/workspace";

type CreateScenarioInput = {
  ownerId: string;
  projectId: string;
  name: string;
  board: unknown;
  players: unknown;
  result?: unknown;
};

export async function createScenario(input: CreateScenarioInput) {
  if (input.ownerId === "demo-user") {
    await ensureDemoUser();
  }

  return db.scenario.create({
    data: input,
  });
}
