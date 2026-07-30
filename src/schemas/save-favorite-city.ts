import * as z from "zod/v4";

// Tool: save_favorite_city
// Saves a city locally as a favorite
export const saveFavoriteCityInputSchema = z.object({
  city: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .describe("The name of the city to save as a favorite."),
});