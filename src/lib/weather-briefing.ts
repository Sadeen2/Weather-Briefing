import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { weatherBriefingFixtureSchema } from "../schemas/weather-briefing-data.js";
import {
  weatherBriefingResultSchema,
  type WeatherBriefingResult,
} from "../schemas/weather-briefing-data.js";
import { searchCity } from "./search-city.js";
import {
  getForecastData,
  getWeatherData,
} from "./weather-data.js";

type TemperatureUnit = "celsius" | "fahrenheit";

type CurrentWeather = {
  temperature: number;
  conditions: string;
  humidity: number;
  windSpeed: number;
};

type ForecastEntry = {
  date: string;
  minTemp: number;
  maxTemp: number;
  conditions: string;
};

const dataDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../data",
);

const fixturePath = path.resolve(
  dataDirectory,
  "create-weather-briefing-fixture.json",
);

function convertTemperature(
  temperature: number,
  units: TemperatureUnit,
): number {
  if (units === "fahrenheit") {
    return Math.round(((temperature * 9) / 5 + 32) * 10) / 10;
  }

  return temperature;
}

function getTemperatureSymbol(units: TemperatureUnit): string {
  return units === "fahrenheit" ? "°F" : "°C";
}

function hasRainyConditions(conditions: string): boolean {
  const normalizedConditions = conditions.toLowerCase();

  return (
    normalizedConditions.includes("rain") ||
    normalizedConditions.includes("drizzle") ||
    normalizedConditions.includes("thunderstorm")
  );
}

export function buildWeatherBriefing(
  location: string,
  current: CurrentWeather,
  forecast: ForecastEntry[],
  units: TemperatureUnit,
): WeatherBriefingResult {
  const symbol = getTemperatureSymbol(units);

  const currentTemperature = convertTemperature(
    current.temperature,
    units,
  );

  const highlights = [
    `Current temperature: ${currentTemperature}${symbol}`,
    `Conditions: ${current.conditions}`,
    `Humidity: ${current.humidity}%`,
    `Wind speed: ${current.windSpeed} km/h`,
  ];

  let briefing =
  `In ${location}, the current temperature is ${currentTemperature}${symbol} ` +
  `with ${current.conditions.toLowerCase()} conditions.`;

  for (const day of forecast) {
    const minimumTemperature = convertTemperature(
      day.minTemp,
      units,
    );

    const maximumTemperature = convertTemperature(
      day.maxTemp,
      units,
    );

    highlights.push(
      `${day.date}: ${day.conditions}, ` +
        `${minimumTemperature}${symbol} to ${maximumTemperature}${symbol}`,
    );
  }

  const firstForecast = forecast[0];

  if (firstForecast) {
    const minimumTemperature = convertTemperature(
      firstForecast.minTemp,
      units,
    );

    const maximumTemperature = convertTemperature(
      firstForecast.maxTemp,
      units,
    );

    briefing +=
      ` The forecast is ${firstForecast.conditions.toLowerCase()}, ` +
      `with temperatures between ${minimumTemperature}${symbol} and ` +
      `${maximumTemperature}${symbol}.`;
  }

  const umbrellaRecommended = forecast.some((day) =>
    hasRainyConditions(day.conditions),
  );

  if (umbrellaRecommended) {
    briefing += " Carrying an umbrella is recommended.";
    highlights.push("Umbrella recommended");
  }

  return weatherBriefingResultSchema.parse({
    briefing,
    highlights,
  });
}

export async function loadWeatherBriefingFixture() {
  const relativePath = path.relative(dataDirectory, fixturePath);

  if (
    relativePath.startsWith("..") ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error(
      "Weather briefing fixture must be inside the data directory.",
    );
  }

  const rawText = await fs.readFile(fixturePath, "utf8");

  if (rawText.trim() === "") {
    throw new Error("Weather briefing fixture is empty.");
  }

  let rawData: unknown;

  try {
    rawData = JSON.parse(rawText) as unknown;
  } catch {
    throw new Error("Weather briefing fixture contains malformed JSON.");
  }

  return weatherBriefingFixtureSchema.parse(rawData);
}

async function createFixtureBriefing(
  location: string,
  units: TemperatureUnit,
): Promise<WeatherBriefingResult | null> {
  const fixture = await loadWeatherBriefingFixture();

  if (
    fixture.location.toLowerCase() !==
    location.trim().toLowerCase()
  ) {
    return null;
  }

  return buildWeatherBriefing(
    fixture.location,
    fixture.current,
    [fixture.forecast],
    units,
  );
}

export async function createWeatherBriefingData(
  location: string,
  days = 1,
  units: TemperatureUnit = "celsius",
): Promise<WeatherBriefingResult | { message: string }> {
  const normalizedLocation = location.trim();
  const selectedDays = Math.min(Math.max(Math.trunc(days), 1), 7);

  if (!normalizedLocation) {
    return {
      message: "A city or location is required.",
    };
  }

  try {
    const citySearch = await searchCity(normalizedLocation);
    const city = citySearch.results[0];

    if (!city) {
      const fixtureResult = await createFixtureBriefing(
        normalizedLocation,
        units,
      );

      return (
        fixtureResult ?? {
          message: `No location was found for "${normalizedLocation}".`,
        }
      );
    }

    const [currentWeather, forecastData] = await Promise.all([
      getWeatherData(city.latitude, city.longitude),
      getForecastData(
        city.latitude,
        city.longitude,
        selectedDays,
      ),
    ]);

    if (
      "message" in currentWeather ||
      forecastData.forecast.length === 0
    ) {
      const fixtureResult = await createFixtureBriefing(
        normalizedLocation,
        units,
      );

      return (
        fixtureResult ?? {
          message:
            "No weather data was found for the requested location.",
        }
      );
    }

    return buildWeatherBriefing(
      city.name,
      currentWeather,
      forecastData.forecast,
      units,
    );
  } catch (error) {
    console.error(
      `[create_weather_briefing] failed for "${normalizedLocation}":`,
      error instanceof Error ? error.message : error,
    );

    try {
      const fixtureResult = await createFixtureBriefing(
        normalizedLocation,
        units,
      );

      return (
        fixtureResult ?? {
          message:
            "The weather briefing could not be created at this time.",
        }
      );
    } catch (fixtureError) {
      console.error(
        "[create_weather_briefing] fixture fallback failed:",
        fixtureError instanceof Error
          ? fixtureError.message
          : fixtureError,
      );

      return {
        message:
          "The weather briefing could not be created at this time.",
      };
    }
  }
}