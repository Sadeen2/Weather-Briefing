import { McpServer } from "@modelcontextprotocol/server";

import {
  createJsonTextResponse,
  createSafeErrorResponse,
} from "../lib/mcp-response.js";
import { saveFavoriteCity } from "../lib/favorite-cities.js";
import { saveFavoriteCityInputSchema } from "../schemas/save-favorite-city.js";

export function registerSaveFavoriteCityTool(
  server: McpServer,
): void {
  server.registerTool(
    "save_favorite_city",
    {
      description:
        "Saves a city to the user's locally stored favorites.",
      inputSchema: saveFavoriteCityInputSchema,
    },
    async ({ city }) => {
      try {
        const result = await saveFavoriteCity(city);

        return createJsonTextResponse(result);
      } catch (error) {
        console.error(
          "[save_favorite_city] Failed to save favorite city:",
          error,
        );
        return createSafeErrorResponse(
          "Unable to save favorite city. The local favorites store is unavailable.",
        );
      }
    },
  );
}