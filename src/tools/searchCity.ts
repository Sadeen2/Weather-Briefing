import { McpServer } from "@modelcontextprotocol/server";
import { searchCityInputSchema } from "../schemas/searchCity.js";

export function registerSearchCityTool(server: McpServer) {
  server.registerTool(
    "search_city",
    {
      title: "Search City",
      description: "Resolves a city name to geographic coordinates",
      inputSchema: searchCityInputSchema.shape,
    },
    async ({ city }) => {
      // TODO: implement real geocoding call (stub for now)
      return {
        content: [
          {
            type: "text",
            text: `Stub result: would search for city "${city}"`,
          },
        ],
      };
    }
  );
}