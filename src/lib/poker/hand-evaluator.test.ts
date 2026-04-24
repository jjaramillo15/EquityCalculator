import { describe, expect, it } from "vitest";
import { scoreSevenCardHand } from "./hand-evaluator";

describe("scoreSevenCardHand", () => {
  it("ranks a pair above high card", () => {
    const highCard = scoreSevenCardHand([
      "Ah",
      "Kd",
      "9c",
      "7s",
      "4d",
      "3c",
      "2h",
    ]);
    const onePair = scoreSevenCardHand([
      "Ah",
      "Ad",
      "9c",
      "7s",
      "4d",
      "3c",
      "2h",
    ]);

    expect(onePair).toBeGreaterThan(highCard);
  });

  it("recognizes a wheel straight below trips", () => {
    const wheel = scoreSevenCardHand([
      "Ah",
      "2d",
      "3c",
      "4s",
      "5d",
      "9c",
      "Kh",
    ]);
    const trips = scoreSevenCardHand([
      "Ah",
      "Ad",
      "Ac",
      "4s",
      "5d",
      "9c",
      "Kh",
    ]);

    expect(trips).toBeGreaterThan(wheel);
  });

  it("uses kickers inside the same category", () => {
    const topKicker = scoreSevenCardHand([
      "Ah",
      "Kd",
      "Ks",
      "7s",
      "4d",
      "3c",
      "2h",
    ]);
    const weakKicker = scoreSevenCardHand([
      "Qh",
      "Kd",
      "Ks",
      "7s",
      "4d",
      "3c",
      "2h",
    ]);

    expect(topKicker).toBeGreaterThan(weakKicker);
  });
});
