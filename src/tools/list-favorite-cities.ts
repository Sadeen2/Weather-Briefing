import { McpServer } from "@modelcontextprotocol/server";
import { listFavoriteCitiesInputSchema } from "../schemas/list-favorite-cities.js";

export function registerListFavoriteCitiesTool(server: McpServer): void {
  server.registerTool(
    "list_favorite_cities",
    {
      description:
        "Returns the list of cities that were previously saved as favorites.",
      inputSchema: listFavoriteCitiesInputSchema,
    },
    async () => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              ok: false,
              tool: "list_favorite_cities",
              status: "not implemented yet",
            },
            null,
            2,
          ),
        },
      ],
    }),
  );
}