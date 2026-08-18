import { getForecastInputSchema } from "../src/schemas/get-forecast.js";

const acceptedCases = [
  { city: "Hebron", days: 3 },
  { city: "  Ramallah  ", days: 1 },
];

const rejectedCases = [
  { city: "", days: 3 },
  { city: "   ", days: 3 },
  { city: 31, days: 3 },
  { city: "Hebron" },
  { latitude: 31.5326, longitude: 35.0998, days: 3 },
  { city: "Hebron", days: 0 },
  { city: "Hebron", days: 8 },
  { city: "Hebron", days: 2.5 },
  { city: "Hebron", days: "3" },
];

for (const testCase of acceptedCases) {
  if (!getForecastInputSchema.safeParse(testCase).success) {
    throw new Error(`Expected acceptance for ${JSON.stringify(testCase)}`);
  }
}

for (const testCase of rejectedCases) {
  if (getForecastInputSchema.safeParse(testCase).success) {
    throw new Error(`Expected rejection for ${JSON.stringify(testCase)}`);
  }
}

console.log("getForecastInputSchema validation passed");