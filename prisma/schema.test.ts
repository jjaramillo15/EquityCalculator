import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("schema.prisma", () => {
  it("contains the core MVP models", () => {
    const schema = readFileSync("prisma/schema.prisma", "utf8");

    expect(schema).toContain("model User");
    expect(schema).toContain("model Project");
    expect(schema).toContain("model Scenario");
    expect(schema).toContain("model SavedRange");
    expect(schema).toContain("model SharedScenarioLink");
  });
});
