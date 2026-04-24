import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("POST /api/scenarios/calculate", () => {
  it("returns numeric equities for a valid request", async () => {
    const response = await POST(
      new Request("http://localhost/api/scenarios/calculate", {
        method: "POST",
        body: JSON.stringify({
          projectId: "project-1",
          name: "Spot",
          board: [],
          players: [
            { label: "Hero", fixedHand: ["Ah", "Ad"], rangeText: null },
            { label: "Villain", fixedHand: ["Kh", "Kd"], rangeText: null },
          ],
        }),
      }),
    );

    const data = await response.json();

    expect(data.players).toHaveLength(2);
    expect(
      data.players.every(
        (player: { equity: number }) => typeof player.equity === "number",
      ),
    ).toBe(true);
  });
});
