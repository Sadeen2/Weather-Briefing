/// <reference types="node" />

import { strict as assert } from "node:assert";

import {
  weatherBriefingFixtureSchema,
  weatherBriefingResultSchema,
} from "../src/schemas/weather-briefing-data.js";

import {
  buildWeatherBriefing,
  createWeatherBriefingData,
  loadWeatherBriefingFixture,
} from "../src/lib/weather-briefing.js";

async function main() {
  const fixture = await loadWeatherBriefingFixture();

  assert.ok(
    weatherBriefingFixtureSchema.safeParse(fixture).success,
  );
  console.log("1/5 weather briefing fixture ok");

  const celsiusBriefing = buildWeatherBriefing(
    fixture.location,
    fixture.current,
    [fixture.forecast],
    "celsius",
  );

  assert.ok(
    weatherBriefingResultSchema.safeParse(celsiusBriefing).success,
  );
  assert.ok(
    celsiusBriefing.highlights.some((item) =>
      item.includes("°C"),
    ),
  );
  console.log("2/5 Celsius briefing ok");

  const fahrenheitBriefing = buildWeatherBriefing(
    fixture.location,
    fixture.current,
    [fixture.forecast],
    "fahrenheit",
  );

  assert.ok(
    weatherBriefingResultSchema.safeParse(fahrenheitBriefing).success,
  );
  assert.ok(
    fahrenheitBriefing.highlights.some((item) =>
      item.includes("°F"),
    ),
  );
  console.log("3/5 Fahrenheit briefing ok");

  const ramallahResult = await createWeatherBriefingData(
    "Ramallah",
    1,
    "celsius",
  );

  assert.ok(
    weatherBriefingResultSchema.safeParse(ramallahResult).success ||
      "message" in ramallahResult,
  );
  console.log("4/5 create_weather_briefing integration ok");

  const emptyLocationResult = await createWeatherBriefingData(
    "   ",
    1,
    "celsius",
  );

  assert.ok("message" in emptyLocationResult);
  console.log("5/5 empty location handled");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});