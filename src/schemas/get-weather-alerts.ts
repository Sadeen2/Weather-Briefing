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

// Validates the shape of Open-Meteo's forecast response before we trust it
export const openMeteoForecastResponseSchema = z.object({
  daily: z
    .object({
      time: z.array(z.string()),
      weather_code: z.array(z.number()),
      wind_speed_10m_max: z.array(z.number()),
    })
    .optional(),
});