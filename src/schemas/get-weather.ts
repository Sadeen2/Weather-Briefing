import * as z from "zod/v4";

export const getWeatherInputSchema = z.object({
  latitude: z
    .number()
    .finite()
    .min(-90)
    .max(90)
    .describe("The geographic latitude in degrees."),
  longitude: z
    .number()
    .finite()
    .min(-180)
    .max(180)
    .describe("The geographic longitude in degrees."),
});
