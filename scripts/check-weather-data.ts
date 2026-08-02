/// <reference types="node" />

import { strict as assert } from "node:assert";

import {
  compareWeatherFixtureSchema,
  compareWeatherResultSchema,
  forecastFixtureSchema,
  forecastEntrySchema,
  forecastResultSchema,
  weatherFixtureSchema,
  weatherResultSchema,
} from "../src/schemas/weather-data.js";
import {
  compareWeatherData,
  getForecastData,
  getWeatherData,
  loadCompareWeatherFixture,
  loadForecastFixture,
  loadWeatherFixture,
} from "../src/lib/weather-data.js";

async function main() {
  const weatherFixture = await loadWeatherFixture();
  assert.ok(weatherFixtureSchema.safeParse(weatherFixture).success);
  console.log("1/9 weather fixture ok");

  const forecastFixture = await loadForecastFixture();
  assert.ok(forecastFixtureSchema.safeParse(forecastFixture).success);
  console.log("2/9 forecast fixture ok");

  const compareFixture = await loadCompareWeatherFixture();
  assert.ok(compareWeatherFixtureSchema.safeParse(compareFixture).success);
  console.log("3/9 compare fixture ok");

  const weather = await getWeatherData(31.5326, 35.0998);
  assert.ok(
    weatherResultSchema.safeParse(weather).success || "message" in weather,
  );
  console.log("4/9 get_weather ok");

  const forecast = await getForecastData(31.5326, 35.0998, 2);
  assert.ok(forecastResultSchema.safeParse(forecast).success);
  assert.ok(forecast.forecast.length <= 2);
  console.log("5/9 get_forecast limit ok");

  const comparison = await compareWeatherData("Hebron", "Ramallah");
  assert.ok(compareWeatherResultSchema.safeParse(comparison).success);
  console.log("6/9 compare_weather cities ok");

  const missingCity = await compareWeatherData("Hebron", "Missing City");
  assert.ok("message" in missingCity);
  console.log("7/9 compare_weather missing city ok");

  assert.equal(
    weatherResultSchema.safeParse({
      temperature: Number.NaN,
      conditions: "Sunny",
      humidity: 40,
      windSpeed: 10,
    }).success,
    false,
  );
  console.log("8/9 invalid weather payload rejected");

  assert.equal(
    forecastEntrySchema.safeParse({
      date: "2026-08-01",
      minTemp: 20,
      conditions: "Sunny",
    }).success,
    false,
  );
  console.log("9/9 invalid forecast row rejected");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
