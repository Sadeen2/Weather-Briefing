import { McpServer } from "@modelcontextprotocol/server";
import { searchCityInputSchema } from "../schemas/search-city.js";
import { searchCity } from "../lib/search-city.js";

export function registerSearchCityTool(server: McpServer) {
  server.registerTool(
    "search_city",
    {
      title: "Search City",
      description: "Resolves a city name to geographic coordinates",
      inputSchema: searchCityInputSchema.shape,
    },
    async ({ city }) => {
      const result = await searchCity(city);
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