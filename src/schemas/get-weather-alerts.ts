import * as z from "zod/v4";

// Tool: get_weather_alerts
// Returns active weather warnings or alerts for a specified location when alert information is available
export const getWeatherAlertsInputSchema = z.object({
  location: z
    .string()
    .min(1)
    .max(100)
    .describe("The city or location name to check for active weather alerts."),
});