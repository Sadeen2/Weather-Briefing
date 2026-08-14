import type {
  BriefingResult,
  CompareWeatherResult,
  CurrentWeather,
  FavoriteCitiesResult,
  ForecastResult,
  GeoCity,
  SaveFavoriteCityResult,
  SearchCityResult,
  TemperatureUnit,
  ToolDescriptor,
  WeatherAlertsResult,
} from "../types/cirra";

const CITY_FIXTURES: GeoCity[] = [
  { name: "Ramallah", country: "Palestine", latitude: 31.9038, longitude: 35.2034, timezone: "Asia/Hebron" },
  { name: "Hebron", country: "Palestine", latitude: 31.5326, longitude: 35.0998, timezone: "Asia/Hebron" },
  { name: "Nablus", country: "Palestine", latitude: 32.2211, longitude: 35.2544, timezone: "Asia/Hebron" },
  { name: "Gaza", country: "Palestine", latitude: 31.5017, longitude: 34.4668, timezone: "Asia/Gaza" },
  { name: "Jerusalem", country: "Palestine", latitude: 31.7683, longitude: 35.2137, timezone: "Asia/Hebron" },
  { name: "Amman", country: "Jordan", latitude: 31.9454, longitude: 35.9284, timezone: "Asia/Amman" },
  { name: "Cairo", country: "Egypt", latitude: 30.0444, longitude: 31.2357, timezone: "Africa/Cairo" },
  { name: "London", country: "United Kingdom", latitude: 51.5072, longitude: -0.1276, timezone: "Europe/London" },
];

const CONDITION_LIBRARY = [
  { key: "clear", label: "Clear sky" },
  { key: "sunny", label: "Sunny" },
  { key: "cloudy", label: "Partly cloudy" },
  { key: "overcast", label: "Overcast" },
  { key: "rain", label: "Light rain" },
  { key: "storm", label: "Thunderstorm" },
  { key: "fog", label: "Fog" },
];

const ALERT_FIXTURES: WeatherAlertsResult = {
  source: "fixture",
  alerts: [
    { city: "Ramallah", date: "2026-08-12", type: "Thunderstorm", severity: "moderate", description: "Thunderstorm expected. Weather code 95." },
    { city: "Gaza", date: "2026-08-12", type: "High Wind", severity: "low", description: "Strong winds expected near coastal areas." },
    { city: "Nablus", date: "2026-08-12", type: "Heavy Rain", severity: "moderate", description: "Heavy rain expected. Weather code 65." },
  ],
};

const FAVORITES_KEY = "cirra.favoriteCities";

const TOOL_DESCRIPTORS: ToolDescriptor[] = [
  { name: "search_city", title: "Search City", description: "Resolve a city name into geocoded location matches.", inputs: ["city"], status: "Available" },
  { name: "get_weather", title: "Current Weather", description: "Get current conditions for any supported city.", inputs: ["city"], status: "Available" },
  { name: "get_forecast", title: "Forecast", description: "Show up to seven days of forecast data.", inputs: ["city", "days"], status: "Available" },
  { name: "create_weather_briefing", title: "Cirra Briefing", description: "Create a concise weather briefing with practical guidance.", inputs: ["location", "days", "units"], status: "Available" },
  { name: "compare_weather", title: "Compare Weather", description: "Compare current weather between two cities.", inputs: ["city1", "city2"], status: "Available" },
  { name: "get_weather_alerts", title: "Weather Alerts", description: "Check for active alerts on a city.", inputs: ["location"], status: "Available" },
  { name: "save_favorite_city", title: "Save Favorite", description: "Save a city to the user's favorite list.", inputs: ["city"], status: "Available" },
  { name: "list_favorite_cities", title: "List Favorites", description: "Read the saved favorite city list.", inputs: [], status: "Available" },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function hashText(text: string): number {
  let hash = 0;

  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeCityName(city: string): string {
  return city.trim().replace(/\s+/g, " ");
}

function convertTemperature(value: number, units: TemperatureUnit): number {
  if (units === "fahrenheit") {
    return Math.round((value * 9) / 5 + 32);
  }

  return Math.round(value);
}

function formatDayLabel(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(date).toUpperCase();
}

function formatDate(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().split("T")[0];
}

function selectCondition(seed: number) {
  return CONDITION_LIBRARY[seed % CONDITION_LIBRARY.length];
}

function buildCityWeather(city: GeoCity, units: TemperatureUnit): CurrentWeather {
  const seed = hashText(city.name);
  const condition = selectCondition(seed);
  const baseTemperature = clamp(Math.round(18 + (city.latitude % 8) + (seed % 7) - 2), 8, 36);

  return {
    location: city,
    temperature: convertTemperature(baseTemperature, units),
    conditions: condition.label,
    humidity: clamp(35 + (seed % 45), 24, 92),
    windSpeed: clamp(5 + (seed % 19), 4, 34),
  };
}

function buildForecast(city: GeoCity, days: number, units: TemperatureUnit): ForecastResult {
  const seed = hashText(`${city.name}:${days}`);

  return {
    location: city,
    forecast: Array.from({ length: days }, (_, index) => {
      const daySeed = seed + index * 13;
      const condition = selectCondition(daySeed);
      const maxTemperature = clamp(Math.round(19 + (city.latitude % 6) + (daySeed % 8)), 9, 38);
      const minTemperature = clamp(maxTemperature - (4 + (daySeed % 5)), 4, maxTemperature - 1);

      return {
        date: formatDate(index),
        maxTemp: convertTemperature(maxTemperature, units),
        minTemp: convertTemperature(minTemperature, units),
        conditions: condition.label,
      };
    }),
    source: "demo",
  };
}

function buildBriefing(city: GeoCity, days: number, units: TemperatureUnit): BriefingResult {
  const weather = buildCityWeather(city, units);
  const forecast = buildForecast(city, Math.max(1, Math.min(days, 7)), units).forecast[0];
  const unitSymbol = units === "fahrenheit" ? "°F" : "°C";
  const umbrellaLine = /rain|storm/i.test(forecast.conditions)
    ? "Carry an umbrella or light rain shell."
    : "No umbrella needed today.";

  return {
    briefing: `${city.name} is ${weather.conditions.toLowerCase()} with ${weather.temperature}${unitSymbol}, ${weather.humidity}% humidity, and ${weather.windSpeed} km/h winds. ${formatDayLabel(1)} should stay ${forecast.conditions.toLowerCase()} with temperatures between ${forecast.minTemp}${unitSymbol} and ${forecast.maxTemp}${unitSymbol}. ${umbrellaLine}`,
    highlights: [
      `${weather.temperature}${unitSymbol} now`,
      `Humidity ${weather.humidity}%`,
      `Wind ${weather.windSpeed} km/h`,
      umbrellaLine,
    ],
  };
}

function buildAlerts(city: GeoCity): WeatherAlertsResult {
  const seed = hashText(city.name);
  const condition = selectCondition(seed);

  if (condition.key === "clear" || condition.key === "sunny") {
    return { alerts: [], source: "demo" };
  }

  const severity = condition.key === "storm" ? "high" : condition.key === "rain" ? "moderate" : "low";

  return {
    alerts: [
      {
        city: city.name,
        date: formatDate(0),
        type: condition.key === "fog" ? "Fog Advisory" : `${condition.label} Alert`,
        severity,
        description: `${condition.label} expected. Conditions may change quickly over ${city.name}.`,
      },
    ],
    source: "demo",
  };
}

function getSavedFavorites(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item): item is string => typeof item === "string")
      .map((item) => normalizeCityName(item))
      .filter(Boolean);
  } catch {
    return [];
  }
}

function setSavedFavorites(favorites: string[]): void {
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function sortSuggestions(results: GeoCity[], query: string): GeoCity[] {
  const normalizedQuery = query.toLowerCase();

  return results.sort((first, second) => {
    const firstExact = first.name.toLowerCase() === normalizedQuery ? 0 : 1;
    const secondExact = second.name.toLowerCase() === normalizedQuery ? 0 : 1;

    if (firstExact !== secondExact) {
      return firstExact - secondExact;
    }

    const firstStarts = first.name.toLowerCase().startsWith(normalizedQuery) ? 0 : 1;
    const secondStarts = second.name.toLowerCase().startsWith(normalizedQuery) ? 0 : 1;

    if (firstStarts !== secondStarts) {
      return firstStarts - secondStarts;
    }

    return first.name.localeCompare(second.name);
  });
}

export const cirraTools = TOOL_DESCRIPTORS;

export async function searchCity(city: string): Promise<SearchCityResult> {
  await delay(220);
  const normalized = normalizeCityName(city);

  if (!normalized) {
    return { results: [], source: "demo" };
  }

  const matches = CITY_FIXTURES.filter((entry) => {
    const lower = normalized.toLowerCase();
    return entry.name.toLowerCase().includes(lower) || entry.country.toLowerCase().includes(lower);
  });

  return {
    results: sortSuggestions(matches, normalized).slice(0, 5),
    source: "demo",
    note: matches.length > 5 ? `Showing 5 of ${matches.length} matches.` : undefined,
  };
}

export async function getWeather(city: string, units: TemperatureUnit): Promise<CurrentWeather | { message: string }> {
  await delay(260);
  const result = await searchCity(city);
  const location = result.results[0];

  if (!location) {
    return { message: "LOCATION_NOT_FOUND" };
  }

  return buildCityWeather(location, units);
}

export async function getForecast(city: string, days: number, units: TemperatureUnit): Promise<ForecastResult | { message: string }> {
  await delay(260);
  const result = await searchCity(city);
  const location = result.results[0];

  if (!location) {
    return { message: "LOCATION_NOT_FOUND" };
  }

  return buildForecast(location, clamp(days, 1, 7), units);
}

export async function createWeatherBriefing(location: string, days: number, units: TemperatureUnit): Promise<BriefingResult | { message: string }> {
  await delay(300);
  const result = await searchCity(location);
  const city = result.results[0];

  if (!city) {
    return { message: "LOCATION_NOT_FOUND" };
  }

  return buildBriefing(city, days, units);
}

export async function compareWeather(city1: string, city2: string, units: TemperatureUnit): Promise<CompareWeatherResult | { message: string }> {
  await delay(320);
  const [firstResult, secondResult] = await Promise.all([searchCity(city1), searchCity(city2)]);
  const firstCity = firstResult.results[0];
  const secondCity = secondResult.results[0];

  if (!firstCity || !secondCity) {
    return { message: "LOCATION_NOT_FOUND" };
  }

  return {
    city1: buildCityWeather(firstCity, units),
    city2: buildCityWeather(secondCity, units),
  };
}

export async function getWeatherAlerts(location: string): Promise<WeatherAlertsResult | { message: string }> {
  await delay(240);
  const result = await searchCity(location);
  const city = result.results[0];

  if (!city) {
    return { message: "LOCATION_NOT_FOUND" };
  }

  const alerts = buildAlerts(city);

  if (alerts.alerts.length === 0) {
    return {
      alerts: [],
      source: "demo",
      note: `Conditions currently look safe for ${city.name}.`,
    };
  }

  return alerts;
}

export async function listFavoriteCities(): Promise<FavoriteCitiesResult> {
  await delay(120);
  return { favorites: getSavedFavorites() };
}

export async function saveFavoriteCity(city: string): Promise<SaveFavoriteCityResult> {
  await delay(120);
  const normalized = normalizeCityName(city);
  const favorites = getSavedFavorites();
  const existing = favorites.find((favorite) => favorite.toLowerCase() === normalized.toLowerCase());

  if (existing) {
    return { success: true, savedCity: existing, favorites, duplicate: true };
  }

  const updated = [...favorites, normalized];
  setSavedFavorites(updated);

  return { success: true, savedCity: normalized, favorites: updated, duplicate: false };
}

export async function getFavoriteSummaries(units: TemperatureUnit): Promise<CurrentWeather[]> {
  const favorites = getSavedFavorites();
  const summaries = await Promise.all(
    favorites.map(async (favorite) => {
      const result = await getWeather(favorite, units);
      return "message" in result ? null : result;
    }),
  );

  return summaries.filter((item): item is CurrentWeather => item !== null);
}
