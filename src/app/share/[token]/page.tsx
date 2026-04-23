import { EquityResults } from "@/components/scenario/equity-results";
import { getSharedScenario } from "@/lib/shares";
import { notFound } from "next/navigation";

type SharedScenarioPageProps = {
  params: Promise<{ token: string }>;
};

export default async function SharedScenarioPage({
  params,
}: SharedScenarioPageProps) {
  const { token } = await params;
  const sharedScenario = await getSharedScenario(token);

  if (!sharedScenario) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-table backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brass-300">
          Shared Scenario
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-white">
          Read-only share
        </h1>
        <p className="mt-3 text-base leading-7 text-stone-300">
          This scenario is view-only. Use it to review the current board state
          and equity snapshot without editing the source project.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[1.75rem] border border-white/10 bg-black/10 p-5">
            <h2 className="text-xl font-semibold text-white">
              {sharedScenario.scenario.name}
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-400">
              Token: {sharedScenario.token}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {sharedScenario.scenario.board.map((card) => (
                <span
                  key={card}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-stone-100"
                >
                  {card}
                </span>
              ))}
            </div>
          </section>

          <EquityResults players={sharedScenario.scenario.players} />
        </div>
      </section>
    </main>
  );
}
