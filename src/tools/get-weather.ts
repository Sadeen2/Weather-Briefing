import { McpServer } from "@modelcontextprotocol/server";
import { getWeatherInputSchema } from "../schemas/get-weather.js";

export function registerGetWeatherTool(server: McpServer): void {
  server.registerTool(
    "get_weather",
    {
      description:
        "Returns the current weather conditions for the provided geographic coordinates.",
      inputSchema: getWeatherInputSchema,
    },
    async ({ latitude, longitude }) => ({
      content: [
        {
          type: "text",
          text: `Validated coordinates: latitude ${latitude}, longitude ${longitude}.`,
        },
      ],
    }),
  );
}
