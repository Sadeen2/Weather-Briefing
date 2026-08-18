import { openMeteoGeocodingResponseSchema } from "../schemas/search-city.js";
import { citiesFixtureSchema } from "../schemas/weather-data.js";

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

    // Validate fixture data before trusting or using it.
    const fixtureValidation = citiesFixtureSchema.safeParse(fixtureCities);

    if (!fixtureValidation.success) {
      console.error(
        "[search_city] fixture validation failed.",
      );

      return {
        results: [],
        source: "fixture" as const,
        note: "Live API unavailable and local fixture data is invalid.",
      };
    }

    const normalizedKey = normalizedCity.toLowerCase();

    const allFallbackMatches =
      fixtureValidation.data.cities.filter((cityEntry) =>
        cityEntry.name.toLowerCase().includes(normalizedKey),
      );

    const fallbackResults = allFallbackMatches
      .slice(0, MAX_RESULTS)
      .map((cityEntry) => ({
        name: cityEntry.name,
        latitude: cityEntry.latitude,
        longitude: cityEntry.longitude,
        country: cityEntry.country,
        timezone: "unknown",
      }));

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