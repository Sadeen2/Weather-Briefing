import { openMeteoGeocodingResponseSchema } from "../schemas/search-city.js";
import { fetchJson } from "./http.js";
import fixtureCities from "../../data/cities.json" with { type: "json" };

export async function searchCity(city: string) {
  try {
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

    return { results, source: "live" as const };
  } catch (error) {
    console.error(
      `[search_city] failed for "${city}":`,
      error instanceof Error ? error.message : error,
    );

    const MAX_FALLBACK_RESULTS = 5;

    const allFallbackMatches = fixtureCities.cities.filter((c) =>
      c.name.toLowerCase().includes(city.toLowerCase()),
    );
    const fallbackResults = allFallbackMatches.slice(0, MAX_FALLBACK_RESULTS);
    const truncated = allFallbackMatches.length > MAX_FALLBACK_RESULTS;

    return {
      results: fallbackResults,
      source: "fixture" as const,
      note: truncated
        ? `Live API unavailable, used local fixture. Showing ${MAX_FALLBACK_RESULTS} of ${allFallbackMatches.length} matches.`
        : "Live API unavailable, used local fixture.",
    };
  }
}