import { McpServer } from "@modelcontextprotocol/server";
import { compareWeatherInputSchema } from "../schemas/compare-weather.js";

export function registerCompareWeatherTool(server: McpServer): void {
  server.registerTool(
    "compare_weather",
    {
      description: "Compares current weather conditions between two cities",
      inputSchema: compareWeatherInputSchema,
    },
    async ({ city1, city2 }) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              ok: false,
              stub: true,
              tool: "compare_weather",
              message: "not implemented yet",
            },
            null,
            2,
          ),
        },
      ],
    }),
  );
}
