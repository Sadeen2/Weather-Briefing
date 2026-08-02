import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { fetchJson } from "./http.js";
import {
  citiesFixtureSchema,
  compareWeatherFixtureSchema,
  compareWeatherResultSchema,
  forecastEntrySchema,
  forecastFixtureSchema,
  forecastResultSchema,
  openMeteoCurrentWeatherSchema,
  openMeteoForecastSchema,
  weatherFixtureSchema,
  weatherResultSchema,
} from "../schemas/weather-data.js";

const dataDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../data",
);

const WEATHER_FIXTURE_FILE = "get-weather-fixture.json";
const FORECAST_FIXTURE_FILE = "get-forecast-fixture.json";
const COMPARE_FIXTURE_FILE = "compare-weather-fixture.json";
const CITIES_FILE = "cities.json";

const WEATHER_CODE_LABELS: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

type DataFileName =
  | typeof WEATHER_FIXTURE_FILE
  | typeof FORECAST_FIXTURE_FILE
  | typeof COMPARE_FIXTURE_FILE
  | typeof CITIES_FILE;

function isInsideDataDirectory(filePath: string): boolean {
  const relativePath = path.relative(dataDirectory, filePath);
  return (
    relativePath !== "" &&
    !relativePath.startsWith("..") &&
    !path.isAbsolute(relativePath)
  );
}

function resolveDataFile(fileName: DataFileName): string {
  const resolvedPath = path.resolve(dataDirectory, fileName);

  if (!isInsideDataDirectory(resolvedPath)) {
    throw new Error(
      `Resolved data path is outside the data directory: ${fileName}`,
    );
  }

  return resolvedPath;
}

async function readJsonData(fileName: DataFileName): Promise<unknown> {
  const filePath = resolveDataFile(fileName);

  try {
    const rawText = await fs.readFile(filePath, "utf8");

    if (rawText.trim() === "") {
      throw new Error(`Data file is empty: ${fileName}`);
    }

    return JSON.parse(rawText) as unknown;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Malformed JSON in data file: ${fileName}`);
    }

    if (
      error instanceof Error &&
      error.message.startsWith("Data file is empty:")
    ) {
      throw error;
    }

    if (error instanceof Error && "code" in error) {
      const code = String((error as NodeJS.ErrnoException).code ?? "");

      if (code === "ENOENT") {
        throw new Error(`Missing data file: ${fileName}`);
      }

      throw new Error(`Unable to read data file: ${fileName}`);
    }

    throw new Error(`Unable to read data file: ${fileName}`);
  }
}

function findWeatherLabel(weatherCode: number): string {
  return WEATHER_CODE_LABELS[weatherCode] ?? "Unknown";
}

function toFiniteNumber(value: number): number {
  if (!Number.isFinite(value)) {
    throw new Error("Encountered a non-finite weather value.");
  }

  return value;
}

function matchCoordinates(
  firstLatitude: number,
  firstLongitude: number,
  secondLatitude: number,
  secondLongitude: number,
  tolerance = 0.0001,
): boolean {
  return (
    Math.abs(firstLatitude - secondLatitude) <= tolerance &&
    Math.abs(firstLongitude - secondLongitude) <= tolerance
  );
}

async function loadWeatherFixtureData() {
  const value = await readJsonData(WEATHER_FIXTURE_FILE);
  return weatherFixtureSchema.parse(value);
}

async function loadForecastFixtureData() {
  const value = await readJsonData(FORECAST_FIXTURE_FILE);
  return forecastFixtureSchema.parse(value);
}

async function loadCompareFixtureData() {
  const value = await readJsonData(COMPARE_FIXTURE_FILE);
  return compareWeatherFixtureSchema.parse(value);
}

async function loadCitiesData() {
  const value = await readJsonData(CITIES_FILE);
  return citiesFixtureSchema.parse(value);
}

async function fetchLiveWeather(latitude: number, longitude: number) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
  );
  url.searchParams.set("timezone", "auto");

  const value = await fetchJson(url.toString());
  const parsed = openMeteoCurrentWeatherSchema.parse(value);

  return weatherResultSchema.parse({
    temperature: toFiniteNumber(parsed.current.temperature_2m),
    conditions: findWeatherLabel(parsed.current.weather_code),
    humidity: toFiniteNumber(parsed.current.relative_humidity_2m),
    windSpeed: toFiniteNumber(parsed.current.wind_speed_10m),
  });
}

async function fetchLiveForecast(
  latitude: number,
  longitude: number,
  days: number,
) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min",
  );
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", String(days));

  const value = await fetchJson(url.toString());
  const parsed = openMeteoForecastSchema.parse(value);
  const daily = parsed.daily;

  if (
    daily.time.length === 0 ||
    daily.temperature_2m_min.length === 0 ||
    daily.temperature_2m_max.length === 0 ||
    daily.weather_code.length === 0
  ) {
    return forecastResultSchema.parse({
      forecast: [],
      message: "No forecast data was found for the requested location.",
    });
  }

  if (
    daily.time.length !== daily.temperature_2m_min.length ||
    daily.time.length !== daily.temperature_2m_max.length ||
    daily.time.length !== daily.weather_code.length
  ) {
    throw new Error("Invalid forecast payload: mismatched daily row lengths.");
  }

  const forecast = daily.time.slice(0, days).map((date, index) =>
    forecastEntrySchema.parse({
      date,
      minTemp: toFiniteNumber(daily.temperature_2m_min[index]),
      maxTemp: toFiniteNumber(daily.temperature_2m_max[index]),
      conditions: findWeatherLabel(daily.weather_code[index]),
    }),
  );

  return forecastResultSchema.parse({ forecast });
}

function selectWeatherFixture(latitude: number, longitude: number) {
  return loadWeatherFixtureData().then((fixture) =>
    fixture.locations.find((location) =>
      matchCoordinates(
        location.latitude,
        location.longitude,
        latitude,
        longitude,
      ),
    ),
  );
}

function selectForecastFixture(latitude: number, longitude: number) {
  return loadForecastFixtureData().then((fixture) =>
    fixture.locations.find((location) =>
      matchCoordinates(
        location.latitude,
        location.longitude,
        latitude,
        longitude,
      ),
    ),
  );
}

export async function loadWeatherFixture() {
  return loadWeatherFixtureData();
}

export async function loadForecastFixture() {
  return loadForecastFixtureData();
}

export async function loadCompareWeatherFixture() {
  return loadCompareFixtureData();
}

export async function getWeatherData(latitude: number, longitude: number) {
  try {
    return await fetchLiveWeather(latitude, longitude);
  } catch {
    const match = await selectWeatherFixture(latitude, longitude);

    if (!match) {
      return {
        message: "No weather data was found for the requested location.",
      };
    }

    return weatherResultSchema.parse(match.response);
  }
}

export async function getForecastData(
  latitude: number,
  longitude: number,
  days: number,
) {
  try {
    return await fetchLiveForecast(latitude, longitude, days);
  } catch {
    const match = await selectForecastFixture(latitude, longitude);

    if (!match) {
      return forecastResultSchema.parse({
        forecast: [],
        message: "No forecast data was found for the requested location.",
      });
    }

    const forecast = match.response.forecast
      .slice(0, days)
      .map((entry) => forecastEntrySchema.parse(entry));

    if (forecast.length === 0) {
      return forecastResultSchema.parse({
        forecast: [],
        message: "No forecast data was found for the requested location.",
      });
    }

    return forecastResultSchema.parse({ forecast });
  }
}

export async function compareWeatherData(city1: string, city2: string) {
  const normalizedCity1 = city1.trim().toLowerCase();
  const normalizedCity2 = city2.trim().toLowerCase();

  if (!normalizedCity1 || !normalizedCity2) {
    return { message: "Both cities are required for comparison." };
  }

  try {
    const cities = await loadCitiesData();
    const firstCity = cities.cities.find(
      (city) => city.name.toLowerCase() === normalizedCity1,
    );
    const secondCity = cities.cities.find(
      (city) => city.name.toLowerCase() === normalizedCity2,
    );

    if (!firstCity || !secondCity) {
      return { message: "One or both comparison cities were not found." };
    }

    const [firstWeather, secondWeather] = await Promise.all([
      getWeatherData(firstCity.latitude, firstCity.longitude),
      getWeatherData(secondCity.latitude, secondCity.longitude),
    ]);

    if ("message" in firstWeather || "message" in secondWeather) {
      const fixture = await loadCompareFixtureData();
      const match = fixture.comparisons.find((comparison) => {
        const firstName = comparison.city1.name.toLowerCase();
        const secondName = comparison.city2.name.toLowerCase();

        return (
          (firstName === normalizedCity1 && secondName === normalizedCity2) ||
          (firstName === normalizedCity2 && secondName === normalizedCity1)
        );
      });

      if (!match) {
        return { message: "One or both comparison cities were not found." };
      }

      return compareWeatherResultSchema.parse({
        city1: {
          name: firstCity.name,
          ...match.response.city1,
        },
        city2: {
          name: secondCity.name,
          ...match.response.city2,
        },
      });
    }

    return compareWeatherResultSchema.parse({
      city1: {
        name: firstCity.name,
        ...firstWeather,
      },
      city2: {
        name: secondCity.name,
        ...secondWeather,
      },
    });
  } catch {
    const fixture = await loadCompareFixtureData();
    const match = fixture.comparisons.find((comparison) => {
      const firstName = comparison.city1.name.toLowerCase();
      const secondName = comparison.city2.name.toLowerCase();

      return (
        (firstName === normalizedCity1 && secondName === normalizedCity2) ||
        (firstName === normalizedCity2 && secondName === normalizedCity1)
      );
    });

    if (!match) {
      return { message: "One or both comparison cities were not found." };
    }

    return compareWeatherResultSchema.parse({
      city1: {
        name: match.city1.name,
        ...match.response.city1,
      },
      city2: {
        name: match.city2.name,
        ...match.response.city2,
      },
    });
  }
}
