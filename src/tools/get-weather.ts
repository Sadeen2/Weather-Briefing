import { McpServer } from "@modelcontextprotocol/server";
import { getWeatherInputSchema } from "../schemas/get-weather.js";
import {
  createJsonTextResponse,
  createSafeErrorResponse,
} from "../lib/mcp-response.js";
import { searchCity } from "../lib/search-city.js";
import { getWeatherData } from "../lib/weather-data.js";

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

export function registerGetWeatherTool(server: McpServer): void {
  server.registerTool(
    "get_weather",
    {
      description: "Returns current weather conditions for a city.",
      inputSchema: getWeatherInputSchema,
    },
    async ({ city }) => {
      try {
        const location = await resolveCityLocation(city);

        if (!location) {
          return createSafeErrorResponse("LOCATION_NOT_FOUND");
        }

        const result = await getWeatherData(
          location.latitude,
          location.longitude,
        );

        if ("message" in result) {
          return createJsonTextResponse(result);
        }

        return createJsonTextResponse(result);
      } catch (error) {
        console.error("[get_weather] Failed to load weather data:", error);
        return createSafeErrorResponse(
          "Unable to load weather data for the requested location.",
        );
      }
    },
  );
}
