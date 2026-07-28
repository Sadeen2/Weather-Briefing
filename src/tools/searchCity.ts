import { searchCityInputSchema } from "../schemas/searchCity";

export const searchCityTool = {
  name: "search_city",
  description: "Resolves a city name to geographic coordinates",
  inputSchema: searchCityInputSchema,
  handler: async (input: { city: string }) => {
    // TODO: implement actual geocoding logic
    return { message: `Stub: searching for ${input.city}` };
  },
};