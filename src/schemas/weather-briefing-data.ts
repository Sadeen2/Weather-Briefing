import * as z from "zod/v4";

export const weatherBriefingFixtureSchema = z.object({
  location: z.string().min(1),

  current: z.object({
    temperature: z.number().finite(),
    conditions: z.string().min(1),
    humidity: z.number().finite(),
    windSpeed: z.number().finite(),
  }),

  forecast: z.object({
    date: z.string().min(1),
    minTemp: z.number().finite(),
    maxTemp: z.number().finite(),
    conditions: z.string().min(1),
    precipitationProbability: z.number().min(0).max(100),
  }),

  briefing: z.string().min(1),

  highlights: z.array(z.string().min(1)).min(1),
});

export const weatherBriefingResultSchema = z.object({
  briefing: z.string().min(1),
  highlights: z.array(z.string().min(1)).min(1),
});

export type WeatherBriefingResult = z.infer<
  typeof weatherBriefingResultSchema
>;