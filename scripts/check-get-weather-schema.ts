import { getWeatherInputSchema } from "../src/schemas/get-weather.js";

const acceptedCases = [
  { city: "Hebron" },
  { city: "  Ramallah  " },
];

const rejectedCases = [
  { city: "" },
  { city: "   " },
  { city: 31 },
  { city: null },
  { city: undefined },
  { latitude: 31.5326, longitude: 35.0998 },
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