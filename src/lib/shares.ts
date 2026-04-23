import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";

type SharedScenarioView = {
  token: string;
  scenario: {
    id: string;
    name: string;
    board: string[];
    players: Array<{ label: string; equity: number }>;
  };
};

const DEMO_SHARED_SCENARIO: SharedScenarioView = {
  token: "demo-token",
  scenario: {
    id: "scenario-demo",
    name: "Demo Shared Spot",
    board: ["Ah", "Kd", "7c"],
    players: [
      { label: "Hero", equity: 50 },
      { label: "Villain", equity: 50 },
    ],
  },
};

export async function createShareLink(scenarioId: string) {
  return db.sharedScenarioLink.create({
    data: {
      scenarioId,
      token: randomUUID(),
    },
  });
}

export async function getSharedScenario(token: string) {
  if (token === DEMO_SHARED_SCENARIO.token) {
    return DEMO_SHARED_SCENARIO;
  }

  const shareLink = await db.sharedScenarioLink.findUnique({
    where: { token },
    include: {
      scenario: true,
    },
  });

  if (!shareLink) {
    return null;
  }

  return {
    token: shareLink.token,
    scenario: {
      id: shareLink.scenario.id,
      name: shareLink.scenario.name,
      board: Array.isArray(shareLink.scenario.board)
        ? (shareLink.scenario.board as string[])
        : [],
      players:
        shareLink.scenario.result &&
        typeof shareLink.scenario.result === "object" &&
        shareLink.scenario.result !== null &&
        "players" in shareLink.scenario.result &&
        Array.isArray(shareLink.scenario.result.players)
          ? (shareLink.scenario.result.players as Array<{
              label: string;
              equity: number;
            }>)
          : [],
    },
  };
}
