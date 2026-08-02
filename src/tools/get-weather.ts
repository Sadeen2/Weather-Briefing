import { McpServer } from "@modelcontextprotocol/server";
import { getWeatherInputSchema } from "../schemas/get-weather.js";
import {
  createJsonTextResponse,
  createSafeErrorResponse,
} from "../lib/mcp-response.js";
import { getWeatherData } from "../lib/weather-data.js";

export function registerGetWeatherTool(server: McpServer): void {
  server.registerTool(
    "get_weather",
    {
      description:
        "Returns the current weather conditions for the provided geographic coordinates.",
      inputSchema: getWeatherInputSchema,
    },
    async ({ latitude, longitude }) => {
      try {
        const result = await getWeatherData(latitude, longitude);
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
