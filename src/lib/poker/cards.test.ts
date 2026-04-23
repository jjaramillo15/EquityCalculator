import { describe, expect, it } from "vitest";
import { allCards, parseCard, unavailableCards } from "./cards";

describe("cards", () => {
  it("parses a valid card token", () => {
    expect(parseCard("Ah")).toEqual({ rank: "A", suit: "h", code: "Ah" });
  });

  it("builds the 52-card deck", () => {
    expect(allCards()).toHaveLength(52);
  });

  it("marks board and fixed-hand cards as unavailable", () => {
    expect(unavailableCards(["Ah", "Kd"], [["Qc", "Qs"]])).toEqual([
      "Ah",
      "Kd",
      "Qc",
      "Qs",
    ]);
  });
});
