import { McpServer } from "@modelcontextprotocol/server";
import { createWeatherBriefingInputSchema } from "../schemas/create-weather-briefing.js";

export function registerCreateWeatherBriefingTool(
  server: McpServer,
): void {
  server.registerTool(
    "create_weather_briefing",
    {
      description:
        "Creates a short and practical weather briefing with recommendations for a location.",
      inputSchema: createWeatherBriefingInputSchema,
    },
    async ({ location, days, units }) => {
      const selectedDays = days ?? 1;
      const selectedUnits = units ?? "celsius";

      return {
        content: [
          {
            type: "text",
            text:
              `Weather briefing requested for ${location}. ` +
              `Forecast days: ${selectedDays}. ` +
              `Temperature units: ${selectedUnits}.`,
          },
        ],
      };
    },
  );
}