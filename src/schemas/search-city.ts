import * as z from "zod/v4";

// Tool: search_city
// Resolves a city name to geographic coordinates
export const searchCityInputSchema = z.object({
  city: z
    .string()
    .min(1)
    .max(100)
    .describe("The name of the city to search for"),
});