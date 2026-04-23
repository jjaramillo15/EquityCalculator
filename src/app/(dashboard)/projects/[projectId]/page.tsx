"use client";

import { SavedRangeList } from "@/components/ranges/saved-range-list";
import { BoardPicker } from "@/components/scenario/board-picker";
import { EquityResults } from "@/components/scenario/equity-results";
import { PlayerPanel } from "@/components/scenario/player-panel";
import { use } from "react";

type ProjectWorkspacePageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

const DEMO_RANGES = [
  {
    id: "range-1",
    name: "CO Open",
    textValue: "22+,A2s+,K9s+,QTs+,JTs,ATo+,KJo+",
  },
  {
    id: "range-2",
    name: "BB Defend",
    textValue: "44+,A2s+,K8s+,Q9s+,J9s+,T9s,98s,AJo+,KQo",
  },
];

const DEMO_RESULTS = [
  { label: "Hero", equity: 52 },
  { label: "Villain", equity: 48 },
];

export default function ProjectWorkspacePage({
  params,
}: ProjectWorkspacePageProps) {
  const { projectId } = use(params);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-table backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brass-300">
          Project Workspace
        </p>
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Workspace</h1>
            <p className="mt-2 text-base leading-7 text-stone-300">
              Build reusable scenarios, apply your range library, and review
              quick equity output for {projectId}.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="rounded-full border border-brass-300/40 bg-brass-300/10 px-5 py-3 text-sm font-semibold text-brass-200"
            >
              Calculate Equity
            </button>
            <button
              type="button"
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-stone-100"
            >
              Save Scenario
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.8fr_1fr]">
          <section className="space-y-6">
            <PlayerPanel />
            <section className="rounded-[1.75rem] border border-white/10 bg-black/10 p-5">
              <h2 className="text-xl font-semibold text-white">Board</h2>
              <p className="mt-2 text-sm leading-6 text-stone-400">
                Pick community cards while respecting blocked cards from the
                active ranges.
              </p>
              <div className="mt-4">
                <BoardPicker
                  value={["Ah", "Kd"]}
                  unavailable={["As", "Ac"]}
                  onChange={() => undefined}
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
                <SavedRangeList ranges={DEMO_RANGES} />
              </div>
            </section>
            <EquityResults players={DEMO_RESULTS} />
          </aside>
        </div>
      </section>
    </main>
  );
}
