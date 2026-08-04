import * as z from "zod/v4";

export const weatherResultSchema = z
  .object({
    temperature: z.number().finite(),
    conditions: z.string().min(1),
    humidity: z.number().finite(),
    windSpeed: z.number().finite(),
  })
  .passthrough();

export const weatherFixtureLocationSchema = z
  .object({
    name: z.string().min(1),
    country: z.string().min(1),
    latitude: z.number().finite(),
    longitude: z.number().finite(),
    response: weatherResultSchema,
  })
  .passthrough();

export const weatherFixtureSchema = z
  .object({
    locations: z.array(weatherFixtureLocationSchema).min(1),
  })
  .passthrough();

export const openMeteoCurrentWeatherSchema = z
  .object({
    current: z
      .object({
        temperature_2m: z.number().finite(),
        relative_humidity_2m: z.number().finite(),
        wind_speed_10m: z.number().finite(),
        weather_code: z.number().finite().int(),
      })
      .passthrough(),
  })
  .passthrough();

export const forecastEntrySchema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    minTemp: z.number().finite(),
    maxTemp: z.number().finite(),
    conditions: z.string().min(1),
  })
  .passthrough();

export const forecastResultSchema = z
  .object({
    forecast: z.array(forecastEntrySchema),
    message: z.string().min(1).optional(),
  })
  .passthrough();

export const forecastFixtureLocationSchema = z
  .object({
    name: z.string().min(1),
    country: z.string().min(1),
    latitude: z.number().finite(),
    longitude: z.number().finite(),
    response: z
      .object({
        forecast: z.array(forecastEntrySchema),
      })
      .passthrough(),
  })
  .passthrough();

export const forecastFixtureSchema = z
  .object({
    locations: z.array(forecastFixtureLocationSchema).min(1),
  })
  .passthrough();

export const openMeteoForecastSchema = z
  .object({
    daily: z
      .object({
        time: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
        temperature_2m_min: z.array(z.number().finite()),
        temperature_2m_max: z.array(z.number().finite()),
        weather_code: z.array(z.number().finite().int()),
      })
      .passthrough(),
  })
  .passthrough();

export const compareWeatherCitySchema = z
  .object({
    name: z.string().min(1),
    country: z.string().min(1),
    latitude: z.number().finite(),
    longitude: z.number().finite(),
  })
  .passthrough();

export const compareWeatherResultCitySchema = z
  .object({
    name: z.string().min(1),
    temperature: z.number().finite(),
    conditions: z.string().min(1),
    humidity: z.number().finite(),
    windSpeed: z.number().finite(),
  })
  .passthrough();

export const compareWeatherFixtureResponseCitySchema = z
  .object({
    temperature: z.number().finite(),
    conditions: z.string().min(1),
    humidity: z.number().finite(),
    windSpeed: z.number().finite(),
  })
  .passthrough();

export const compareWeatherResultSchema = z
  .object({
    city1: compareWeatherResultCitySchema,
    city2: compareWeatherResultCitySchema,
  })
  .passthrough();

export const compareWeatherFixtureEntrySchema = z
  .object({
    city1: compareWeatherCitySchema,
    city2: compareWeatherCitySchema,
    response: z
      .object({
        city1: compareWeatherFixtureResponseCitySchema,
        city2: compareWeatherFixtureResponseCitySchema,
      })
      .passthrough(),
  })
  .passthrough();

export const compareWeatherFixtureSchema = z
  .object({
    comparisons: z.array(compareWeatherFixtureEntrySchema).min(1),
  })
  .passthrough();

export const citiesFixtureSchema = z
  .object({
    cities: z.array(compareWeatherCitySchema).min(1),
  })
  .passthrough();
