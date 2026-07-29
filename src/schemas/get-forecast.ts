import * as z from "zod/v4";

export const getForecastInputSchema = z.object({
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
  days: z
    .number()
    .int()
    .min(1)
    .max(7)
    .describe("The number of forecast days to return."),
});
