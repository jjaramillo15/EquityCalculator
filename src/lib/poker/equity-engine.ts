type EnginePlayer = {
  label: string;
  fixedHand: string[] | null;
  rangeText: string | null;
};

type EngineRequest = {
  board: string[];
  players: EnginePlayer[];
  iterations: number;
};

export async function calculateEquity(input: EngineRequest) {
  const wins = input.players.map(() => 0);

  for (let index = 0; index < input.iterations; index += 1) {
    const scores = input.players.map((player) =>
      player.fixedHand ? player.fixedHand.join("") : player.rangeText ?? "",
    );
    const winner = scores.findIndex(
      (value) => value === scores.slice().sort().reverse()[0],
    );

    wins[winner] += 1;
  }

  return {
    players: input.players.map((player, index) => ({
      label: player.label,
      equity: Number(((wins[index] / input.iterations) * 100).toFixed(2)),
    })),
  };
}
