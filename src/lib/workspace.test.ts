import { beforeEach, describe, expect, it, vi } from "vitest";

const userUpsertMock = vi.hoisted(() => vi.fn());
const projectUpsertMock = vi.hoisted(() => vi.fn());
const savedRangeUpsertMock = vi.hoisted(() => vi.fn());
const scenarioUpsertMock = vi.hoisted(() => vi.fn());
const projectFindManyMock = vi.hoisted(() => vi.fn());
const savedRangeFindManyMock = vi.hoisted(() => vi.fn());
const projectFindUniqueMock = vi.hoisted(() => vi.fn());
const scenarioFindFirstMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/db", () => ({
  db: {
    user: { upsert: userUpsertMock },
    project: {
      upsert: projectUpsertMock,
      findMany: projectFindManyMock,
      findUnique: projectFindUniqueMock,
    },
    savedRange: {
      upsert: savedRangeUpsertMock,
      findMany: savedRangeFindManyMock,
    },
    scenario: {
      upsert: scenarioUpsertMock,
      findFirst: scenarioFindFirstMock,
    },
  },
}));

import {
  ensureDemoWorkspaceData,
  getDemoProjectWorkspace,
  listDemoProjects,
  listDemoRanges,
} from "./workspace";

describe("workspace data", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    userUpsertMock.mockResolvedValue({ id: "demo-user" });
    projectUpsertMock.mockResolvedValue(undefined);
    savedRangeUpsertMock.mockResolvedValue(undefined);
    scenarioUpsertMock.mockResolvedValue(undefined);
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
    projectFindUniqueMock.mockResolvedValue({
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
  });

  it("seeds the demo workspace entities", async () => {
    await ensureDemoWorkspaceData();

    expect(userUpsertMock).toHaveBeenCalledTimes(1);
    expect(projectUpsertMock).toHaveBeenCalledTimes(2);
    expect(savedRangeUpsertMock).toHaveBeenCalledTimes(3);
    expect(scenarioUpsertMock).toHaveBeenCalledTimes(2);
  });

  it("loads demo projects from the database", async () => {
    await expect(listDemoProjects()).resolves.toEqual([
      {
        id: "project-1",
        name: "Friday 3-Bet Pots",
        updatedLabel: "Updated 2026-04-23",
      },
    ]);
  });

  it("loads a workspace snapshot from the database", async () => {
    await expect(getDemoProjectWorkspace("project-1")).resolves.toEqual({
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
    });
  });

  it("loads saved ranges from the database", async () => {
    await expect(listDemoRanges()).resolves.toEqual([
      {
        id: "range-1",
        name: "CO Open",
        textValue: "22+,A2s+,K9s+,QTs+,JTs,ATo+,KJo+",
      },
    ]);
  });
});
