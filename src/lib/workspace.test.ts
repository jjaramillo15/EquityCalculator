import { beforeEach, describe, expect, it, vi } from "vitest";

const projectCountMock = vi.hoisted(() => vi.fn());
const projectCreateMock = vi.hoisted(() => vi.fn());
const savedRangeCreateMock = vi.hoisted(() => vi.fn());
const scenarioCreateMock = vi.hoisted(() => vi.fn());
const projectFindManyMock = vi.hoisted(() => vi.fn());
const savedRangeFindManyMock = vi.hoisted(() => vi.fn());
const projectFindFirstMock = vi.hoisted(() => vi.fn());
const scenarioFindFirstMock = vi.hoisted(() => vi.fn());
const scenarioFindManyMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/db", () => ({
  db: {
    project: {
      count: projectCountMock,
      create: projectCreateMock,
      findMany: projectFindManyMock,
      findFirst: projectFindFirstMock,
    },
    savedRange: {
      create: savedRangeCreateMock,
      findMany: savedRangeFindManyMock,
    },
    scenario: {
      create: scenarioCreateMock,
      findFirst: scenarioFindFirstMock,
      findMany: scenarioFindManyMock,
    },
  },
}));

import {
  ensureStarterWorkspaceData,
  getProjectWorkspace,
  listProjectsForOwner,
  listRangesForOwner,
} from "./workspace";

describe("workspace data", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    projectCountMock.mockResolvedValue(0);
    projectCreateMock
      .mockResolvedValueOnce({ id: "project-1" })
      .mockResolvedValueOnce({ id: "project-2" });
    savedRangeCreateMock
      .mockResolvedValueOnce({ id: "range-1" })
      .mockResolvedValueOnce({ id: "range-2" })
      .mockResolvedValueOnce({ id: "range-3" });
    scenarioCreateMock.mockResolvedValue(undefined);
    projectFindManyMock.mockResolvedValue([
      {
        id: "project-1",
        name: "Friday 3-Bet Pots",
        scenarios: [{ updatedAt: new Date("2026-04-23T12:00:00.000Z") }],
      },
    ]);
    savedRangeFindManyMock.mockResolvedValue([
      {
        id: "range-1",
        name: "CO Open",
        textValue: "22+,A2s+,K9s+,QTs+,JTs,ATo+,KJo+",
      },
    ]);
    projectFindFirstMock.mockResolvedValue({
      id: "project-1",
      name: "Friday 3-Bet Pots",
    });
    scenarioFindFirstMock.mockResolvedValue({
      id: "scenario-1",
      name: "BTN vs BB single-raised pot",
      board: ["Ah", "Kd", "7c"],
      result: {
        players: [
          { label: "Hero", equity: 52 },
          { label: "Villain", equity: 48 },
        ],
      },
    });
    scenarioFindManyMock.mockResolvedValue([
      {
        id: "scenario-1",
        name: "BTN vs BB single-raised pot",
        updatedAt: new Date("2026-04-23T12:00:00.000Z"),
      },
    ]);
  });

  it("seeds the starter workspace entities for an owner", async () => {
    await ensureStarterWorkspaceData("user-1");

    expect(projectCreateMock).toHaveBeenCalledTimes(2);
    expect(savedRangeCreateMock).toHaveBeenCalledTimes(3);
    expect(scenarioCreateMock).toHaveBeenCalledTimes(2);
  });

  it("loads owner projects from the database", async () => {
    await expect(listProjectsForOwner("user-1")).resolves.toEqual([
      {
        id: "project-1",
        name: "Friday 3-Bet Pots",
        updatedLabel: "Updated 2026-04-23",
      },
    ]);
  });

  it("loads a workspace snapshot from the database", async () => {
    await expect(getProjectWorkspace("user-1", "project-1")).resolves.toEqual({
      project: {
        id: "project-1",
        name: "Friday 3-Bet Pots",
      },
      ranges: [
        {
          id: "range-1",
          name: "CO Open",
          textValue: "22+,A2s+,K9s+,QTs+,JTs,ATo+,KJo+",
        },
      ],
      board: ["Ah", "Kd", "7c"],
      players: [
        { label: "Hero", equity: 52 },
        { label: "Villain", equity: 48 },
      ],
      recentScenarios: [
        {
          id: "scenario-1",
          name: "BTN vs BB single-raised pot",
          updatedLabel: "Updated 2026-04-23",
        },
      ],
    });
  });

  it("loads saved ranges from the database", async () => {
    await expect(listRangesForOwner("user-1")).resolves.toEqual([
      {
        id: "range-1",
        name: "CO Open",
        textValue: "22+,A2s+,K9s+,QTs+,JTs,ATo+,KJo+",
      },
    ]);
  });
});
