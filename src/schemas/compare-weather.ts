import * as z from "zod/v4";

export const compareWeatherInputSchema = z.object({
  city1: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(
    /^[\p{L}\p{M}]+(?:[ '\-’][\p{L}\p{M}]+)*$/u,
    "City name must contain letters only",
  )
    .describe("The first city to compare."),
  city2: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(
      /^[\p{L}\p{M}]+(?:[ '\-’][\p{L}\p{M}]+)*$/u,
      "City name must contain letters only",
    )
    .describe("The second city to compare."),
});
