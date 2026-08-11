import * as z from "zod/v4";

const CITY_NAME_PATTERN =
  /^[\p{L}\p{M}]+(?:[ .\-’'][\p{L}\p{M}]+)*$/u;

export const compareWeatherInputSchema = z.object({
  city1: z
    .string()
    .trim()
    .min(1, "First city is required.")
    .max(100, "First city must be 100 characters or fewer.")
    .regex(
      CITY_NAME_PATTERN,
      "First city can only include letters, spaces, periods, apostrophes, and hyphens.",
    )
    .describe("The first city to compare."),

  city2: z
    .string()
    .trim()
    .min(1, "Second city is required.")
    .max(100, "Second city must be 100 characters or fewer.")
    .regex(
      CITY_NAME_PATTERN,
      "Second city can only include letters, spaces, periods, apostrophes, and hyphens.",
    )
    .describe("The second city to compare."),
});