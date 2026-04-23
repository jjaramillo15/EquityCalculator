import { describe, expect, it } from "vitest";
import { filterBlockedCombos } from "./combo-filter";

describe("filterBlockedCombos", () => {
  it("drops combos that collide with used cards", () => {
    const combos = ["AhKh", "AsKs", "AcKc"];

    expect(filterBlockedCombos(combos, ["Ah"])).toEqual(["AsKs", "AcKc"]);
  });
});
