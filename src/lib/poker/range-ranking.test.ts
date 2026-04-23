import { describe, expect, it } from "vitest";
import { fillRangeByPercent } from "./range-ranking";

describe("fillRangeByPercent", () => {
  it("starts from premium holdings", () => {
    const range = fillRangeByPercent(2);

    expect(range[0]).toBe("AA");
  });
});
