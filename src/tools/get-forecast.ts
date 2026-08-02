import { McpServer } from "@modelcontextprotocol/server";
import { getForecastInputSchema } from "../schemas/get-forecast.js";
import {
  createJsonTextResponse,
  createSafeErrorResponse,
} from "../lib/mcp-response.js";
import { getForecastData } from "../lib/weather-data.js";

export function registerGetForecastTool(server: McpServer): void {
  server.registerTool(
    "get_forecast",
    {
      description: "Returns a multi-day weather forecast for a location",
      inputSchema: getForecastInputSchema,
    },
    async ({ latitude, longitude, days }) => {
      try {
        const result = await getForecastData(latitude, longitude, days);
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
