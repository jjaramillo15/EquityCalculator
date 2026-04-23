import { describe, expect, it } from "vitest";
import { parseRangeText } from "./range-parser";

describe("parseRangeText", () => {
  it("parses additive plus notation", () => {
    expect(parseRangeText("QQ+,AKs")).toContain("AA");
  });

  it("normalizes duplicates", () => {
    expect(parseRangeText("AKs,AKs").length).toBe(1);
  });
});
