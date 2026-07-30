import { McpServer } from "@modelcontextprotocol/server";
import { getWeatherAlertsInputSchema } from "../schemas/get-weather-alerts.js";

export function registerGetWeatherAlertsTool(server: McpServer): void {
  server.registerTool(
    "get_weather_alerts",
    {
      title: "Get Weather Alerts",
      description:
        "Returns active weather warnings or alerts for a specified location when alert information is available",
      inputSchema: getWeatherAlertsInputSchema.shape,
    },
    async ({ location }) => {
      // TODO: implement real alerts lookup (stub for now)
      return {
        content: [
          {
            type: "text",
            text: `Stub result: would check weather alerts for "${location}"`,
          },
        ],
      };
    },
  );
}