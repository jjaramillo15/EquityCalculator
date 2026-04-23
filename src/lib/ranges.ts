import { db } from "@/lib/db";
import { parseRangeText } from "@/lib/poker/range-parser";
import { ensureDemoUser } from "@/lib/workspace";

type CreateSavedRangeInput = {
  ownerId: string;
  name: string;
  textValue: string;
  matrixState: Record<string, boolean>;
};

export async function createSavedRange(input: CreateSavedRangeInput) {
  if (input.ownerId === "demo-user") {
    await ensureDemoUser();
  }

  return db.savedRange.create({
    data: {
      ownerId: input.ownerId,
      name: input.name,
      textValue: input.textValue,
      matrixState: input.matrixState,
      canonicalRange: parseRangeText(input.textValue),
    },
  });
}
