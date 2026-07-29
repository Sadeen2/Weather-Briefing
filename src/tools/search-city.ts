import { McpServer } from "@modelcontextprotocol/server";
import { searchCityInputSchema } from "../schemas/search-city.js";

export function registerSearchCityTool(server: McpServer) {
  server.registerTool(
    "search_city",
    {
      title: "Search City",
      description: "Resolves a city name to geographic coordinates",
      inputSchema: searchCityInputSchema,
    },
    async ({ city }) => {
      // Week 2: stub only — Week 3 replaces this with real data
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ ok: true, stub: true, tool: "search_city" }, null, 2),
          },
        ],
      };
    }
  );
}