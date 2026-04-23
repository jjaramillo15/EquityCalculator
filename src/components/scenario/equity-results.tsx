type EquityResultsProps = {
  players: Array<{
    label: string;
    equity: number;
  }>;
};

export function EquityResults({ players }: EquityResultsProps) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
      <h2 className="text-xl font-semibold text-white">Equity Results</h2>
      <ul className="mt-4 space-y-3">
        {players.map((player) => (
          <li
            key={player.label}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 px-4 py-3"
          >
            <span className="text-sm font-medium text-stone-200">
              {player.label}
            </span>
            <span className="text-lg font-semibold text-brass-300">
              {player.equity}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
