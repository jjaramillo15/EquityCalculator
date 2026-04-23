"use client";

import { serializeRangeTokens } from "@/lib/poker/range-serializer";
import { fillRangeByPercent } from "@/lib/poker/range-ranking";
import { parseRangeText } from "@/lib/poker/range-parser";
import { SavedRangeList } from "@/components/ranges/saved-range-list";
import { BoardPicker } from "@/components/scenario/board-picker";
import { EquityResults } from "@/components/scenario/equity-results";
import { PlayerPanel } from "@/components/scenario/player-panel";
import { startTransition, useState } from "react";

type WorkspaceRange = {
  id: string;
  name: string;
  textValue: string;
};

type EquityPlayer = {
  label: string;
  equity: number;
};

type RecentScenario = {
  id: string;
  name: string;
  updatedLabel: string;
};

type EditablePlayer = {
  label: string;
  rangeText: string;
  selectedHands: string[];
  fillPercent: number;
};

type ProjectWorkspaceProps = {
  projectId: string;
  projectName: string;
  ranges: WorkspaceRange[];
  board: string[];
  players: EquityPlayer[];
  recentScenarios: RecentScenario[];
};

export function ProjectWorkspace({
  projectId,
  projectName,
  ranges,
  board,
  players,
  recentScenarios,
}: ProjectWorkspaceProps) {
  const [scenarioName, setScenarioName] = useState(`${projectName} Review`);
  const [boardCards, setBoardCards] = useState(board);
  const [editablePlayers, setEditablePlayers] = useState(() =>
    createInitialPlayers(ranges),
  );
  const [results, setResults] = useState(players);
  const [scenarioHistory, setScenarioHistory] = useState(recentScenarios);
  const [statusMessage, setStatusMessage] = useState(
    "Adjust ranges, run the calculation, then save the scenario snapshot.",
  );
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleCalculate() {
    setIsCalculating(true);
    setStatusMessage("Calculating equity...");

    try {
      const response = await fetch("/api/scenarios/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildScenarioPayload()),
      });

      if (!response.ok) {
        throw new Error("Unable to calculate equity.");
      }

      const data = (await response.json()) as { players: EquityPlayer[] };

      startTransition(() => {
        setResults(data.players);
      });
      setStatusMessage("Equity updated.");
    } catch {
      setStatusMessage("Unable to calculate equity right now.");
    } finally {
      setIsCalculating(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    setStatusMessage("Saving scenario...");

    try {
      const response = await fetch("/api/scenarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...buildScenarioPayload(),
          result: {
            players: results,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to save scenario.");
      }

      const savedScenario = (await response.json()) as {
        id: string;
        name: string;
        updatedAt: string;
      };

      startTransition(() => {
        setScenarioHistory((current) => [
          {
            id: savedScenario.id,
            name: savedScenario.name,
            updatedLabel: `Updated ${savedScenario.updatedAt.slice(0, 10)}`,
          },
          ...current.filter((item) => item.id !== savedScenario.id),
        ]);
      });
      setStatusMessage("Scenario saved.");
    } catch {
      setStatusMessage("Unable to save scenario right now.");
    } finally {
      setIsSaving(false);
    }
  }

  function buildScenarioPayload() {
    return {
      projectId,
      name: scenarioName.trim() || `${projectName} Review`,
      board: boardCards,
      players: editablePlayers.map((player) => ({
        label: player.label,
        fixedHand: null,
        rangeText: player.rangeText.trim() || null,
      })),
    };
  }

  function updatePlayer(index: number, next: Partial<EditablePlayer>) {
    setEditablePlayers((current) =>
      current.map((player, playerIndex) =>
        playerIndex === index ? { ...player, ...next } : player,
      ),
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-table backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brass-300">
          Project Workspace
        </p>
        <div className="mt-4 flex flex-col gap-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white">Workspace</h1>
              <p className="mt-2 text-base leading-7 text-stone-300">
                Build reusable scenarios for {projectName}, apply your range
                library, and review quick equity output for {projectId}.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={isCalculating}
                onClick={handleCalculate}
                className="rounded-full border border-brass-300/40 bg-brass-300/10 px-5 py-3 text-sm font-semibold text-brass-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCalculating ? "Calculating..." : "Calculate Equity"}
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSave}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-stone-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Scenario"}
              </button>
            </div>
          </div>

          <label className="block max-w-xl">
            <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-stone-400">
              Scenario Name
            </span>
            <input
              aria-label="Scenario Name"
              type="text"
              value={scenarioName}
              onChange={(event) => setScenarioName(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-brass-300"
            />
          </label>

          <p aria-live="polite" className="text-sm text-stone-300">
            {statusMessage}
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.8fr_1fr]">
          <section className="space-y-6">
            {editablePlayers.map((player, index) => (
              <PlayerPanel
                key={player.label}
                title={player.label}
                rangeText={player.rangeText}
                fillPercent={player.fillPercent}
                selectedHands={player.selectedHands}
                onRangeTextChange={(next) =>
                  updatePlayer(index, createPlayerPatch(player.label, next))
                }
                onFillPercentChange={(next) =>
                  updatePlayer(index, createPercentPatch(player.label, next))
                }
                onSelectedHandsChange={(next) =>
                  updatePlayer(index, createHandPatch(player.label, next))
                }
              />
            ))}

            <section className="rounded-[1.75rem] border border-white/10 bg-black/10 p-5">
              <h2 className="text-xl font-semibold text-white">Board</h2>
              <p className="mt-2 text-sm leading-6 text-stone-400">
                Pick community cards while respecting blocked cards from the
                active ranges.
              </p>
              <div className="mt-4">
                <BoardPicker
                  value={boardCards}
                  unavailable={[]}
                  onChange={(next) => setBoardCards(next.slice(0, 5))}
                />
              </div>
            </section>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
              <h2 className="text-xl font-semibold text-white">Saved Ranges</h2>
              <p className="mt-2 text-sm leading-6 text-stone-400">
                Reuse personal preflop libraries without leaving the workspace.
              </p>
              <div className="mt-4">
                <SavedRangeList ranges={ranges} />
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
              <h2 className="text-xl font-semibold text-white">
                Recent Scenarios
              </h2>
              <div className="mt-4 space-y-3">
                {scenarioHistory.length === 0 ? (
                  <p className="text-sm leading-6 text-stone-400">
                    Save your first scenario to build project history.
                  </p>
                ) : (
                  scenarioHistory.map((scenario) => (
                    <div
                      key={scenario.id}
                      className="rounded-[1.25rem] border border-white/10 bg-black/10 px-4 py-3"
                    >
                      <div className="text-sm font-semibold text-stone-100">
                        {scenario.name}
                      </div>
                      <div className="mt-1 text-xs uppercase tracking-[0.2em] text-stone-500">
                        {scenario.updatedLabel}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <EquityResults players={results} />
          </aside>
        </div>
      </section>
    </main>
  );
}

function createInitialPlayers(ranges: WorkspaceRange[]): EditablePlayer[] {
  const defaults = [
    { label: "Hero", rangeText: ranges[0]?.textValue ?? "QQ+,AKs" },
    { label: "Villain", rangeText: ranges[1]?.textValue ?? "JJ+,AQs" },
  ];

  return defaults.map((player) => {
    const selectedHands = parseRangeText(player.rangeText);

    return {
      label: player.label,
      rangeText: player.rangeText,
      selectedHands,
      fillPercent: getFillPercent(selectedHands),
    };
  });
}

function createPlayerPatch(label: string, rangeText: string) {
  const selectedHands = parseRangeText(rangeText);

  return {
    label,
    rangeText,
    selectedHands,
    fillPercent: getFillPercent(selectedHands),
  };
}

function createPercentPatch(label: string, fillPercent: number) {
  const selectedHands = fillRangeByPercent(fillPercent);

  return {
    label,
    fillPercent,
    selectedHands,
    rangeText: serializeRangeTokens(selectedHands),
  };
}

function createHandPatch(label: string, selectedHands: string[]) {
  return {
    label,
    selectedHands,
    fillPercent: getFillPercent(selectedHands),
    rangeText: serializeRangeTokens(selectedHands),
  };
}

function getFillPercent(selectedHands: string[]) {
  return Math.round((selectedHands.length / 8) * 100);
}
