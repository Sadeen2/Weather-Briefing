import * as z from "zod/v4";

// Tool: search_city
// Resolves a city name to geographic coordinates
export const searchCityInputSchema = z.object({
  city: z
    .string()
    .min(1)
    .max(100)
    .regex(
    /^[\p{L}\p{M}]+(?:[ '\-’][\p{L}\p{M}]+)*$/u,
    "City name must contain letters only",
  )
    .describe("The name of the city to search for"),
});

// Validates the shape of Open-Meteo's geocoding response before we trust it
export const openMeteoGeocodingResponseSchema = z.object({
  results: z
    .array(
      z.object({
        name: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        country: z.string().optional(),
        timezone: z.string().optional(),
      }),
    )
    .optional(),
});