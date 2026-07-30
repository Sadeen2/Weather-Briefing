import { getWeatherInputSchema } from "../src/schemas/get-weather.js";

const acceptedCases = [
  { latitude: 31.5326, longitude: 35.0998 },
  { latitude: -90, longitude: -180 },
  { latitude: 90, longitude: 180 },
];

const rejectedCases = [
  { latitude: 100, longitude: 35 },
  { latitude: -91, longitude: 35 },
  { latitude: 31, longitude: 200 },
  { latitude: 31, longitude: -181 },
  { longitude: 35 },
  { latitude: 31 },
  { latitude: "31", longitude: 35 },
  { latitude: 31, longitude: "35" },
  { latitude: Number.NaN, longitude: 35 },
  { latitude: Number.POSITIVE_INFINITY, longitude: 35 },
];

for (const testCase of acceptedCases) {
  if (!getWeatherInputSchema.safeParse(testCase).success) {
    throw new Error(`Expected acceptance for ${JSON.stringify(testCase)}`);
  }
}

for (const testCase of rejectedCases) {
  if (getWeatherInputSchema.safeParse(testCase).success) {
    throw new Error(`Expected rejection for ${JSON.stringify(testCase)}`);
  }
}

console.log("getWeatherInputSchema validation passed");