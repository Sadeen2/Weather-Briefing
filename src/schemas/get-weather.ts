import * as z from "zod/v4";

export const getWeatherInputSchema = z.object({
  city: z
    .string()
    .trim()
    .min(1, "City is required.")
    .describe("The name of the city to resolve."),
});
