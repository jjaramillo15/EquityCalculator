import { beforeEach, describe, expect, it, vi } from "vitest";
import { createSavedRange } from "./ranges";

const createMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/db", () => ({
  db: {
    savedRange: {
      create: createMock,
    },
  },
}));

describe("createSavedRange", () => {
  beforeEach(() => {
    createMock.mockResolvedValue({ id: "range-1" });
  });

  it("persists a named range payload", async () => {
    await expect(
      createSavedRange({
        ownerId: "user-1",
        name: "CO Open",
        textValue: "22+,A2s+,K9s+,QTs+,JTs,ATo+,KJo+",
        matrixState: { AA: true },
      }),
    ).resolves.toEqual({ id: "range-1" });

    expect(createMock).toHaveBeenCalledWith({
      data: {
        ownerId: "user-1",
        name: "CO Open",
        textValue: "22+,A2s+,K9s+,QTs+,JTs,ATo+,KJo+",
        matrixState: { AA: true },
        canonicalRange: [
          "22+",
          "A2s+",
          "K9s+",
          "QTs+",
          "JTs",
          "ATo+",
          "KJo+",
        ],
      },
    });
  });
});
