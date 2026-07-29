import { McpServer } from "@modelcontextprotocol/server";
import { saveFavoriteCityInputSchema } from "../schemas/save-favorite-city.js";

export function registerSaveFavoriteCityTool(server: McpServer): void {
  server.registerTool(
    "save_favorite_city",
    {
      description:
        "Saves a city locally as a favorite for quick access later.",
      inputSchema: saveFavoriteCityInputSchema,
    },
    async ({ city }) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              ok: false,
              tool: "save_favorite_city",
              status: "not implemented yet",
              input: {
                city,
              },
            },
            null,
            2,
          ),
        },
      ],
    }),
  );
}