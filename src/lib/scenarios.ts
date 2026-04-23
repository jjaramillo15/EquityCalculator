import { db } from "@/lib/db";

type CreateScenarioInput = {
  ownerId: string;
  projectId: string;
  name: string;
  board: unknown;
  players: unknown;
  result?: unknown;
};

export async function createScenario(input: CreateScenarioInput) {
  return db.scenario.create({
    data: input,
  });
}
