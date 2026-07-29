import { McpServer } from "@modelcontextprotocol/server";
import { getForecastInputSchema } from "../schemas/get-forecast.js";

export function registerGetForecastTool(server: McpServer): void {
  server.registerTool(
    "get_forecast",
    {
      description: "Returns a multi-day weather forecast for a location",
      inputSchema: getForecastInputSchema,
    },
    async ({ latitude, longitude, days }) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              ok: false,
              stub: true,
              tool: "get_forecast",
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
