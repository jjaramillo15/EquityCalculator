import { z } from "zod";

export const rangePayloadSchema = z.object({
  name: z.string().min(1).max(120),
  textValue: z.string().min(1),
  matrixState: z.record(z.boolean()),
});
