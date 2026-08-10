import { openMeteoGeocodingResponseSchema } from "../schemas/search-city.js";
import { fetchJson } from "./http.js";
import fixtureCities from "../../data/cities.json" with { type: "json" };

const MAX_RESULTS = 5;

export async function searchCity(city: string) {
  const normalizedCity = city.trim();

  if (!normalizedCity) {
    return {
      results: [],
      source: "fixture" as const,
    };
  }

  try {
    const url = new URL(
      "https://geocoding-api.open-meteo.com/v1/search",
    );

    url.searchParams.set("name", normalizedCity);
    url.searchParams.set("count", String(MAX_RESULTS));
    url.searchParams.set("language", "en");
    url.searchParams.set("format", "json");

    const rawData = await fetchJson(url);
    const data = openMeteoGeocodingResponseSchema.parse(rawData);

    const results = (data.results ?? [])
      .slice(0, MAX_RESULTS)
      .map((result) => ({
        name: result.name,
        latitude: result.latitude,
        longitude: result.longitude,
        country: result.country ?? "unknown",
        timezone: result.timezone ?? "unknown",
      }));

    return {
      results,
      source: "live" as const,
    };
  } catch {
    console.error(
      "[search_city] live lookup failed; using fixture fallback.",
    );

    const normalizedKey = normalizedCity.toLowerCase();

    const allFallbackMatches = fixtureCities.cities.filter((cityEntry) =>
      cityEntry.name.toLowerCase().includes(normalizedKey),
    );

    const fallbackResults =
      allFallbackMatches.slice(0, MAX_RESULTS);

    const truncated =
      allFallbackMatches.length > MAX_RESULTS;

    return {
      results: fallbackResults,
      source: "fixture" as const,
      note: truncated
        ? `Live API unavailable, used local fixture. Showing ${MAX_RESULTS} of ${allFallbackMatches.length} matches.`
        : "Live API unavailable, used local fixture.",
    };
  }
}