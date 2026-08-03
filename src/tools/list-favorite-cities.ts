import { McpServer } from "@modelcontextprotocol/server";

import { listFavoriteCitiesInputSchema } from "../schemas/list-favorite-cities.js";

export function registerListFavoriteCitiesTool(
  server: McpServer,
): void {
  server.registerTool(
    "list_favorite_cities",
    {
      description:
        "Lists the user's saved favorite cities. This P1 tool is not implemented yet.",
      inputSchema: listFavoriteCitiesInputSchema,
    },
    async () => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                status: "not_implemented",
                tool: "list_favorite_cities",
                message:
                  "This P1 tool is not implemented yet. No favorite cities were loaded.",
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