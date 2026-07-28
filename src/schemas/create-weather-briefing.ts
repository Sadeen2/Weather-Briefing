import * as z from "zod/v4";

// Tool: create_weather_briefing
// Creates a practical weather briefing for a specific location
export const createWeatherBriefingInputSchema = z.object({
  location: z
    .string()
    .min(1)
    .max(100)
    .describe("The city or location to create the weather briefing for."),

  days: z
    .number()
    .int()
    .positive()
    .max(7)
    .optional()
    .describe("The number of forecast days to include, defaults to 1."),

  units: z
    .enum(["celsius", "fahrenheit"])
    .optional()
    .describe("The temperature unit to use, defaults to celsius."),
});