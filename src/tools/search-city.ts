import { McpServer } from "@modelcontextprotocol/server";
import {
  searchCityInputSchema,
  openMeteoGeocodingResponseSchema,
} from "../schemas/search-city.js";
import { fetchJson } from "../lib/http.js";
import fixtureCities from "../../data/cities.json" with { type: "json" };

export function registerSearchCityTool(server: McpServer) {
  server.registerTool(
    "search_city",
    {
      title: "Search City",
      description: "Resolves a city name to geographic coordinates",
      inputSchema: searchCityInputSchema.shape,
    },
    async ({ city }) => {
      try {
        // 1. Ask Open-Meteo's geocoding API to resolve the city name
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5&language=en&format=json`;
        const rawData = await fetchJson(url);
        const data = openMeteoGeocodingResponseSchema.parse(rawData);

        const results = (data.results ?? []).map((r) => ({
          name: r.name,
          latitude: r.latitude,
          longitude: r.longitude,
          country: r.country ?? "unknown",
          timezone: r.timezone ?? "unknown",
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ results, source: "live" }, null, 2),
            },
          ],
        };
      } catch (error) {
        console.error(
          `[search_city] failed for "${city}":`,
          error instanceof Error ? error.message : error,
        );

        // 2. Fallback: search the local fixture list if the API/network fails
        const fallbackResults = fixtureCities.cities.filter((c) =>
          c.name.toLowerCase().includes(city.toLowerCase()),
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  results: fallbackResults,
                  source: "fixture",
                  note: "Live API unavailable, used local fixture.",
                },
                null,
                2,
              ),
            },
          ],
        };
      }
    },
  );
}