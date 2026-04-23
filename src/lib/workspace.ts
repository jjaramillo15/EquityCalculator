import { db } from "@/lib/db";

const DEMO_OWNER = {
  id: "demo-user",
  email: "demo@example.com",
  name: "Demo Player",
};

const DEMO_PROJECTS = [
  {
    id: "project-1",
    name: "Friday 3-Bet Pots",
  },
  {
    id: "project-2",
    name: "Blind vs Blind Study",
  },
] as const;

const DEMO_RANGES = [
  {
    id: "range-1",
    name: "CO Open",
    textValue: "22+,A2s+,K9s+,QTs+,JTs,ATo+,KJo+",
    matrixState: { AA: true, AKs: true },
    canonicalRange: ["22+", "A2s+", "K9s+", "QTs+", "JTs", "ATo+", "KJo+"],
  },
  {
    id: "range-2",
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
    id: "range-3",
    name: "3-Bet Value",
    textValue: "TT+,AQs+,AKo",
    matrixState: { TT: true, AKo: true },
    canonicalRange: ["TT+", "AQs+", "AKo"],
  },
] as const;

const DEMO_SCENARIOS = [
  {
    id: "scenario-1",
    projectId: "project-1",
    name: "BTN vs BB single-raised pot",
    board: ["Ah", "Kd", "7c"],
    players: [
      { label: "Hero", rangeId: "range-1" },
      { label: "Villain", rangeId: "range-2" },
    ],
    result: {
      players: [
        { label: "Hero", equity: 52 },
        { label: "Villain", equity: 48 },
      ],
    },
  },
  {
    id: "scenario-2",
    projectId: "project-2",
    name: "Limped blind battle",
    board: ["Qs", "8h", "4d"],
    players: [
      { label: "Hero", rangeId: "range-2" },
      { label: "Villain", rangeId: "range-3" },
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

export async function ensureDemoWorkspaceData() {
  await db.user.upsert({
    where: { id: DEMO_OWNER.id },
    update: {
      email: DEMO_OWNER.email,
      name: DEMO_OWNER.name,
    },
    create: DEMO_OWNER,
  });

  for (const project of DEMO_PROJECTS) {
    await db.project.upsert({
      where: { id: project.id },
      update: {
        name: project.name,
      },
      create: {
        ...project,
        ownerId: DEMO_OWNER.id,
      },
    });
  }

  for (const range of DEMO_RANGES) {
    await db.savedRange.upsert({
      where: { id: range.id },
      update: {
        name: range.name,
        textValue: range.textValue,
        matrixState: range.matrixState,
        canonicalRange: range.canonicalRange,
      },
      create: {
        ...range,
        ownerId: DEMO_OWNER.id,
      },
    });
  }

  for (const scenario of DEMO_SCENARIOS) {
    await db.scenario.upsert({
      where: { id: scenario.id },
      update: {
        name: scenario.name,
        board: scenario.board,
        players: scenario.players,
        result: scenario.result,
      },
      create: {
        ...scenario,
        ownerId: DEMO_OWNER.id,
      },
    });
  }

  return DEMO_OWNER.id;
}

export async function ensureDemoUser() {
  return ensureDemoWorkspaceData();
}

export async function listDemoProjects(): Promise<WorkspaceProjectListItem[]> {
  await ensureDemoWorkspaceData();

  const projects = await db.project.findMany({
    where: { ownerId: DEMO_OWNER.id },
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

export async function listDemoRanges(): Promise<WorkspaceRangeListItem[]> {
  await ensureDemoWorkspaceData();

  const ranges = await db.savedRange.findMany({
    where: { ownerId: DEMO_OWNER.id },
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

export async function getDemoProjectWorkspace(
  projectId: string,
): Promise<WorkspaceSnapshot | null> {
  await ensureDemoWorkspaceData();

  const [project, ranges, scenario] = await Promise.all([
    db.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        name: true,
      },
    }),
    db.savedRange.findMany({
      where: { ownerId: DEMO_OWNER.id },
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
        ownerId: DEMO_OWNER.id,
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
