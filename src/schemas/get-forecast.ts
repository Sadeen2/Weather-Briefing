import * as z from "zod/v4";

export const getForecastInputSchema = z.object({
  city: z
    .string()
    .trim()
    .min(1, "City is required.")
    .describe("The name of the city to resolve."),
  days: z
    .number()
    .int()
    .min(1)
    .max(7)
    .describe("The number of forecast days to return."),
});
