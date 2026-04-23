import { db } from "@/lib/db";
const STARTER_PROJECTS = [
  {
    name: "Friday 3-Bet Pots",
  },
  {
    name: "Blind vs Blind Study",
  },
] as const;

const STARTER_RANGES = [
  {
    name: "CO Open",
    textValue: "22+,A2s+,K9s+,QTs+,JTs,ATo+,KJo+",
    matrixState: { AA: true, AKs: true },
    canonicalRange: ["22+", "A2s+", "K9s+", "QTs+", "JTs", "ATo+", "KJo+"],
  },
  {
    name: "BB Defend",
    textValue: "44+,A2s+,K8s+,Q9s+,J9s+,T9s,98s,AJo+,KQo",
    matrixState: { QQ: true, JTs: true },
    canonicalRange: [
      "44+",
      "A2s+",
      "K8s+",
      "Q9s+",
      "J9s+",
      "T9s+",
      "98s",
      "AJo+",
      "KQo",
    ],
  },
  {
    name: "3-Bet Value",
    textValue: "TT+,AQs+,AKo",
    matrixState: { TT: true, AKo: true },
    canonicalRange: ["TT+", "AQs+", "AKo"],
  },
] as const;

const STARTER_SCENARIOS = [
  {
    projectIndex: 0,
    name: "BTN vs BB single-raised pot",
    board: ["Ah", "Kd", "7c"],
    players: [
      { label: "Hero", rangeIndex: 0 },
      { label: "Villain", rangeIndex: 1 },
    ],
    result: {
      players: [
        { label: "Hero", equity: 52 },
        { label: "Villain", equity: 48 },
      ],
    },
  },
  {
    projectIndex: 1,
    name: "Limped blind battle",
    board: ["Qs", "8h", "4d"],
    players: [
      { label: "Hero", rangeIndex: 1 },
      { label: "Villain", rangeIndex: 2 },
    ],
    result: {
      players: [
        { label: "Hero", equity: 47 },
        { label: "Villain", equity: 53 },
      ],
    },
  },
] as const;

type WorkspaceProjectListItem = {
  id: string;
  name: string;
  updatedLabel: string;
};

type WorkspaceRangeListItem = {
  id: string;
  name: string;
  textValue: string;
};

type WorkspaceSnapshot = {
  project: {
    id: string;
    name: string;
  };
  ranges: WorkspaceRangeListItem[];
  board: string[];
  players: Array<{ label: string; equity: number }>;
};

export async function ensureStarterWorkspaceData(ownerId: string) {
  const existingProjects = await db.project.count({
    where: { ownerId },
  });

  if (existingProjects > 0) {
    return ownerId;
  }

  const createdProjects = [];

  for (const project of STARTER_PROJECTS) {
    createdProjects.push(
      await db.project.create({
        data: {
          ownerId,
          name: project.name,
        },
      }),
    );
  }

  const createdRanges = [];

  for (const range of STARTER_RANGES) {
    createdRanges.push(
      await db.savedRange.create({
        data: {
          ownerId,
          name: range.name,
          textValue: range.textValue,
          matrixState: range.matrixState,
          canonicalRange: range.canonicalRange,
        },
      }),
    );
  }

  for (const scenario of STARTER_SCENARIOS) {
    await db.scenario.create({
      data: {
        ownerId,
        projectId: createdProjects[scenario.projectIndex].id,
        name: scenario.name,
        board: scenario.board,
        players: scenario.players.map((player) => ({
          label: player.label,
          rangeId: createdRanges[player.rangeIndex].id,
        })),
        result: scenario.result,
      },
    });
  }
  
  return ownerId;
}

export async function listProjectsForOwner(
  ownerId: string,
): Promise<WorkspaceProjectListItem[]> {
  await ensureStarterWorkspaceData(ownerId);

  const projects = await db.project.findMany({
    where: { ownerId },
    include: {
      scenarios: {
        select: {
          updatedAt: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "asc",
    },
  });

  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    updatedLabel: `Updated ${formatDateLabel(
      project.scenarios[0]?.updatedAt ?? project.updatedAt,
    )}`,
  }));
}

export async function listRangesForOwner(
  ownerId: string,
): Promise<WorkspaceRangeListItem[]> {
  await ensureStarterWorkspaceData(ownerId);

  const ranges = await db.savedRange.findMany({
    where: { ownerId },
    orderBy: {
      updatedAt: "asc",
    },
  });

  return ranges.map((range) => ({
    id: range.id,
    name: range.name,
    textValue: range.textValue,
  }));
}

export async function getProjectWorkspace(
  ownerId: string,
  projectId: string,
): Promise<WorkspaceSnapshot | null> {
  await ensureStarterWorkspaceData(ownerId);

  const [project, ranges, scenario] = await Promise.all([
    db.project.findUnique({
      where: { id: projectId, ownerId },
      select: {
        id: true,
        name: true,
      },
    }),
    db.savedRange.findMany({
      where: { ownerId },
      orderBy: {
        updatedAt: "asc",
      },
      select: {
        id: true,
        name: true,
        textValue: true,
      },
    }),
    db.scenario.findFirst({
      where: {
        ownerId,
        projectId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        board: true,
        result: true,
      },
    }),
  ]);

  if (!project) {
    return null;
  }

  return {
    project,
    ranges,
    board: Array.isArray(scenario?.board) ? (scenario.board as string[]) : [],
    players: getResultPlayers(scenario?.result),
  };
}

function getResultPlayers(result: unknown) {
  if (
    result &&
    typeof result === "object" &&
    "players" in result &&
    Array.isArray(result.players)
  ) {
    return result.players as Array<{ label: string; equity: number }>;
  }

  return [
    { label: "Hero", equity: 50 },
    { label: "Villain", equity: 50 },
  ];
}

function formatDateLabel(value: Date) {
  return value.toISOString().slice(0, 10);
}
