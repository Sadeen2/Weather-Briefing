import { McpServer } from "@modelcontextprotocol/server";
import { compareWeatherInputSchema } from "../schemas/compare-weather.js";
import {
  createJsonTextResponse,
  createSafeErrorResponse,
} from "../lib/mcp-response.js";
import { compareWeatherData } from "../lib/weather-data.js";

export function registerCompareWeatherTool(server: McpServer): void {
  server.registerTool(
    "compare_weather",
    {
      description: "Compares current weather conditions between two cities",
      inputSchema: compareWeatherInputSchema,
    },
    async ({ city1, city2 }) => {
      try {
        const result = await compareWeatherData(city1, city2);
        return createJsonTextResponse(result);
      } catch (error) {
        console.error("[compare_weather] Failed to compare weather:", error);
        return createSafeErrorResponse(
          "Unable to compare weather for the requested cities.",
        );
      }
    },
  );
}
