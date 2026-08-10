import * as z from "zod/v4";

const CITY_NAME_PATTERN =
  /^[\p{L}\p{M}]+(?:[ .\-’'][\p{L}\p{M}]+)*$/u;

export const getForecastInputSchema = z.object({
  city: z
    .string()
    .trim()
    .min(1, "City is required.")
    .max(100, "City must be 100 characters or fewer.")
    .regex(
      CITY_NAME_PATTERN,
      "City can only include letters, spaces, periods, apostrophes, and hyphens.",
    )
    .describe("The name of the city to resolve."),

  days: z
    .number()
    .int("Days must be a whole number.")
    .min(1, "Days must be at least 1.")
    .max(7, "Days must be 7 or fewer.")
    .describe("The number of forecast days to return."),
});