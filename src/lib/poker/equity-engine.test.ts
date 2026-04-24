import { describe, expect, it } from "vitest";
import { calculateEquity } from "./equity-engine";

describe("calculateEquity", () => {
  it("keeps pocket aces ahead of kings over many samples", async () => {
    const result = await calculateEquity({
      board: [],
      players: [
        { label: "Hero", fixedHand: ["Ah", "Ad"], rangeText: null },
        { label: "Villain", fixedHand: ["Kh", "Kd"], rangeText: null },
      ],
      iterations: 400,
    });

    expect(result.players[0].equity).toBeGreaterThan(result.players[1].equity);
  });

  it("supports range versus range with blocked cards", async () => {
    const result = await calculateEquity({
      board: ["Ah", "Kd", "7c"],
      players: [
        { label: "Hero", fixedHand: null, rangeText: "QQ+,AKs" },
        { label: "Villain", fixedHand: null, rangeText: "JJ+,AQs" },
      ],
      iterations: 300,
    });

    expect(result.players).toHaveLength(2);
    expect(result.players.every((player) => player.equity >= 0)).toBe(true);
  });

  it("splits equity on exact ties", async () => {
    const result = await calculateEquity({
      board: ["Ah", "Kh", "Qh", "Jh", "Th"],
      players: [
        { label: "Hero", fixedHand: ["2c", "3d"], rangeText: null },
        { label: "Villain", fixedHand: ["4c", "5d"], rangeText: null },
      ],
      iterations: 50,
    });

    expect(result.players[0].equity).toBeCloseTo(50, 0);
    expect(result.players[1].equity).toBeCloseTo(50, 0);
  });
});
