import { McpServer } from "@modelcontextprotocol/server";

import { createWeatherBriefingData } from "../lib/weather-briefing.js";
import { createWeatherBriefingInputSchema } from "../schemas/create-weather-briefing.js";

export function registerCreateWeatherBriefingTool(
  server: McpServer,
): void {
  server.registerTool(
    "create_weather_briefing",
    {
      description:
        "Creates a short and practical weather briefing with current conditions, forecast details, and recommendations for a location.",
      inputSchema: createWeatherBriefingInputSchema,
    },
    async ({ location, days, units }) => {
      const result = await createWeatherBriefingData(
        location,
        days ?? 1,
        units ?? "celsius",
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  );
}