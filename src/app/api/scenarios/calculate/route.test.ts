import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("POST /api/scenarios/calculate", () => {
  it("returns player equities", async () => {
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
  });
});
