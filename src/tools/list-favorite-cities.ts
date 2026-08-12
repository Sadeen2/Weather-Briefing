import { McpServer } from "@modelcontextprotocol/server";

import {
  createJsonTextResponse,
  createSafeErrorResponse,
} from "../lib/mcp-response.js";
import { listFavoriteCities } from "../lib/favorite-cities.js";
import { listFavoriteCitiesInputSchema } from "../schemas/list-favorite-cities.js";

export function registerListFavoriteCitiesTool(
  server: McpServer,
): void {
  server.registerTool(
    "list_favorite_cities",
    {
      description:
        "Lists the user's locally stored favorite cities.",
      inputSchema: listFavoriteCitiesInputSchema,
    },
    async () => {
      try {
        const result = await listFavoriteCities();

        return createJsonTextResponse(result);
      } catch (error) {
        console.error(
          "[list_favorite_cities] Failed to load favorite cities:",
          error,
        );
        return createSafeErrorResponse(
          "Unable to load favorite cities. The local favorites store is unavailable.",
        );
      }
    },
  );
}