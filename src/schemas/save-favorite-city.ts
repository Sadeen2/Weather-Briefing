import * as z from "zod/v4";

const CITY_NAME_PATTERN =
  /^[\p{L}\p{M}]+(?:[ .\-’'][\p{L}\p{M}]+)*$/u;

// Tool: save_favorite_city
// Saves a city locally as a favorite
export const saveFavoriteCityInputSchema = z.object({
  city: z
    .string()
    .trim()
    .min(1, "City is required.")
    .max(100, "City must be 100 characters or fewer.")
    .regex(
      CITY_NAME_PATTERN,
      "City can only include letters, spaces, periods, apostrophes, and hyphens.",
    )
    .describe("The name of the city to save as a favorite."),
});