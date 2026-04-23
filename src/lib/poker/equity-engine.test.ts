import { describe, expect, it } from "vitest";
import { calculateEquity } from "./equity-engine";

describe("calculateEquity", () => {
  it("returns one equity value per player", async () => {
    const result = await calculateEquity({
      board: [],
      players: [
        { label: "Hero", fixedHand: ["Ah", "Ad"], rangeText: null },
        { label: "Villain 1", fixedHand: ["Kh", "Kd"], rangeText: null },
        { label: "Villain 2", fixedHand: ["Qh", "Qd"], rangeText: null },
      ],
      iterations: 500,
    });

    expect(result.players).toHaveLength(3);
    expect(result.players.every((player) => typeof player.equity === "number")).toBe(true);
  });
});
