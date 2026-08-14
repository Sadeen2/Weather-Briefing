export type TemperatureUnit = "celsius" | "fahrenheit";

export interface GeoCity {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface SearchCityResult {
  results: GeoCity[];
  source: "demo" | "fixture";
  note?: string;
}

export interface CurrentWeather {
  location: GeoCity;
  temperature: number;
  conditions: string;
  humidity: number;
  windSpeed: number;
}

export interface ForecastDay {
  date: string;
  minTemp: number;
  maxTemp: number;
  conditions: string;
}

export interface ForecastResult {
  location: GeoCity;
  forecast: ForecastDay[];
  source: "demo" | "fixture";
  note?: string;
}

export interface BriefingResult {
  briefing: string;
  highlights: string[];
}

export interface WeatherAlert {
  city: string;
  date: string;
  type: string;
  severity: "low" | "moderate" | "high";
  description: string;
}

export interface WeatherAlertsResult {
  alerts: WeatherAlert[];
  source: "demo" | "fixture";
  note?: string;
}

export interface CompareWeatherResult {
  city1: CurrentWeather;
  city2: CurrentWeather;
}

export interface SaveFavoriteCityResult {
  success: boolean;
  savedCity: string;
  favorites: string[];
  duplicate: boolean;
}

export interface FavoriteCitiesResult {
  favorites: string[];
}

export interface ToolDescriptor {
  name: string;
  title: string;
  description: string;
  inputs: string[];
  status: "Available";
}
