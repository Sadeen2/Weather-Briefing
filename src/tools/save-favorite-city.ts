import { McpServer } from "@modelcontextprotocol/server";

import { saveFavoriteCityInputSchema } from "../schemas/save-favorite-city.js";

export function registerSaveFavoriteCityTool(
  server: McpServer,
): void {
  server.registerTool(
    "save_favorite_city",
    {
      description:
        "Saves a city to the user's favorites. This P1 tool is not implemented yet.",
      inputSchema: saveFavoriteCityInputSchema,
    },
    async ({ city }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                status: "not_implemented",
                tool: "save_favorite_city",
                city,
                message:
                  "This P1 tool is not implemented yet. The city was not saved.",
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );
}