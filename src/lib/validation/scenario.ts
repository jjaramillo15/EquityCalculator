import { z } from "zod";

export const scenarioPayloadSchema = z.object({
  projectId: z.string().min(1),
  name: z.string().min(1),
  board: z.array(z.string().regex(/^[AKQJT98765432][shdc]$/)).max(5),
  players: z
    .array(
      z.object({
        label: z.string().min(1),
        fixedHand: z.array(z.string()).length(2).nullable(),
        rangeText: z.string().nullable(),
      }),
    )
    .min(2),
});

export const scenarioResultSchema = z.object({
  players: z.array(
    z.object({
      label: z.string().min(1),
      equity: z.number(),
    }),
  ),
});

export const savedScenarioPayloadSchema = scenarioPayloadSchema.extend({
  result: scenarioResultSchema.optional(),
});
