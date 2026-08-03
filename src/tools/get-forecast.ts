import { McpServer } from "@modelcontextprotocol/server";
import { getForecastInputSchema } from "../schemas/get-forecast.js";
import {
  createJsonTextResponse,
  createSafeErrorResponse,
} from "../lib/mcp-response.js";
import { searchCity } from "../lib/search-city.js";
import { getForecastData } from "../lib/weather-data.js";

async function resolveCityLocation(city: string): Promise<{
  name: string;
  country: string;
  latitude: number;
  longitude: number;
} | null> {
  const result = await searchCity(city);
  const location = result.results[0];

  if (!location) {
    return null;
  }

  return {
    name: location.name,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
  };
}

export function registerGetForecastTool(server: McpServer): void {
  server.registerTool(
    "get_forecast",
    {
      description: "Returns a multi-day weather forecast for a city.",
      inputSchema: getForecastInputSchema,
    },
    async ({ city, days }) => {
      try {
        const location = await resolveCityLocation(city);

        if (!location) {
          return createSafeErrorResponse("LOCATION_NOT_FOUND");
        }

        const result = await getForecastData(
          location.latitude,
          location.longitude,
          days,
        );

        if ("message" in result) {
          return createJsonTextResponse(result);
        }

        return createJsonTextResponse(result);
      } catch (error) {
        console.error("[get_forecast] Failed to load forecast data:", error);
        return createSafeErrorResponse(
          "Unable to load forecast data for the requested location.",
        );
      }
    },
  );
}
