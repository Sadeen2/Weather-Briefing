# Data Plan — Week 3

This document maps each P0/P1 tool to its data source, fixture fallback, and known failure modes.

## Tools Overview

| Tool                 | Source                                                                                               | Fixture Path                 | Auth | Rate Limits                         | Failure Modes                                                                                               |
| -------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------- | ---- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `search_city`        | Open-Meteo Geocoding API (`https://geocoding-api.open-meteo.com/v1/search`)                          | `./data/cities.json`         | none | ~10,000 req/day (free tier, no key) | empty results (city not found), timeout, HTTP 5xx, malformed query (empty string)                           |
| `get_weather_alerts` | Derived from Open-Meteo Forecast API `weather_code` field (`https://api.open-meteo.com/v1/forecast`) | `./data/weather-alerts.json` | none | ~10,000 req/day (free tier, no key) | timeout, HTTP 5xx, city not found (invalid coordinates), no active alert conditions (empty result is valid) |
| `create_weather_briefing` | Uses Open-Meteo current and forecast weather data to generate a short practical summary and recommendation | `./data/create-weather-briefing-fixture.json` | none | Free public API under fair-use limits; avoid unnecessary repeated requests | empty location, city not found, timeout, HTTP 5xx, unavailable network, missing weather fields, malformed API response, empty fixture file, malformed fixture JSON |

## search_city

Source: Open-Meteo Geocoding API

Example request:

GET https://geocoding-api.open-meteo.com/v1/search?name=Ramallah&count=5&language=en&format=json

Example response (happy path):

{
"results": [
{
"id": 281184,
"name": "Ramallah",
"latitude": 31.9038,
"longitude": 35.2034,
"elevation": 872.0,
"feature_code": "PPLA",
"country_code": "PS",
"timezone": "Asia/Hebron",
"population": 27460,
"country": "Palestine",
"admin1": "Ramallah and al-Bireh"
}
]
}

Fixture fallback (./data/cities.json): small local list of common cities (name, latitude, longitude, country) used if the API call fails or times out.

## get_weather_alerts

Source: Derived logic — fetch weather_code and wind_speed_10m_max from Open-Meteo Forecast API for the given coordinates, then map known WMO codes (e.g. 65, 82, 95, 96, 99) to a human-readable alert.

Example request:

GET https://api.open-meteo.com/v1/forecast?latitude=31.9038&longitude=35.2034&daily=weather_code,wind_speed_10m_max&timezone=auto

Example response (happy path):

{
"alerts": [
{
"city": "Ramallah",
"date": "2026-08-01",
"type": "Thunderstorm",
"severity": "moderate",
"description": "Thunderstorm expected. Weather code 95."
}
]
}

Example response (no alerts — also a valid happy path):

{
"alerts": []
}

Fixture fallback (./data/weather-alerts.json): local sample of 2-3 pre-built alerts for common cities, used if the API call fails or times out.

## create_weather_briefing

Source: The tool first resolves the requested location, then uses Open-Meteo current and forecast weather data.

The tool combines the returned current conditions and forecast information into a short, readable briefing with practical recommendations.

Example request:

GET https://api.open-meteo.com/v1/forecast?latitude=31.9038&longitude=35.2034&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=2&timezone=auto

Example response (happy path):

```json
{
  "briefing": "Ramallah is currently partly cloudy. Tomorrow may have light rain, so carrying an umbrella is recommended.",
  "highlights": [
    "Current temperature: 18°C",
    "Tomorrow's high: 23°C",
    "Rain probability: 60%",
    "Umbrella recommended"
  ]
}
```

Fixture fallback (`./data/create-weather-briefing-fixture.json`): cached current weather, forecast data, and a prepared briefing used when the API is unavailable or the request times out.

Failure modes:

- empty or invalid location
- city not found
- HTTP 5xx response
- request timeout
- unavailable network
- missing current or forecast fields
- malformed API response
- empty fixture file
- malformed fixture JSON
  
## Notes

- No API keys are required for the Open-Meteo data sources used by these tools.
- API-based tools use the shared `fetchJson` helper in `src/lib/http.ts` with an 8-second timeout.
- Demo Day rule: if Wi-Fi or the public API is unavailable, each tool falls back to its documented local fixture file in `./data/`.

## Assigned Weather Tool Data Plan

Demo Day must still work when Wi-Fi or the public API is unavailable, so these three tools use cached fixture files in ./data/ as offline fallbacks.

| tool            | source                                                                                                       | fixture path                        | auth | rate limits                                                                                                  | failure modes                                                                                                                                                                                                                                                     | example response                                                                                                                                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| get_weather     | Open-Meteo current weather API                                                                               | ./data/get-weather-fixture.json     | none | Free public API under public fair-use limits. Keep request volume low.                                       | invalid latitude or longitude; HTTP 5xx response; request timeout; unavailable network; malformed API response; location not found in the fixture; empty fixture file; malformed fixture JSON                                                                     | {"temperature":28.4,"conditions":"Partly cloudy","humidity":41,"windSpeed":12.6}                                                                                                                                                                   |
| get_forecast    | Open-Meteo forecast API                                                                                      | ./data/get-forecast-fixture.json    | none | Free public API under public fair-use limits. Keep request volume low.                                       | invalid latitude or longitude; invalid or unsupported days value; HTTP 5xx response; request timeout; unavailable network; malformed API response; forecast not found in the fixture; empty fixture file; malformed fixture JSON                                  | {"forecast":[{"date":"2026-08-01","minTemp":21.1,"maxTemp":30.3,"conditions":"Partly cloudy"},{"date":"2026-08-02","minTemp":20.4,"maxTemp":31,"conditions":"Sunny"},{"date":"2026-08-03","minTemp":22,"maxTemp":29.8,"conditions":"Light rain"}]} |
| compare_weather | Use data/cities.json to resolve the two city names, then use Open-Meteo current weather data for both cities | ./data/compare-weather-fixture.json | none | The tool may require two weather lookups. Keep request volume low under the free public API fair-use limits. | empty city name; city not found; ambiguous city; one city lookup succeeds while the other fails; HTTP 5xx response; request timeout; unavailable network; malformed API response; comparison not found in the fixture; empty fixture file; malformed fixture JSON | {"city1":{"temperature":28.4,"conditions":"Partly cloudy","humidity":41,"windSpeed":12.6},"city2":{"temperature":27.8,"conditions":"Sunny","humidity":38,"windSpeed":11.2}}                                                                        |

### get_weather example response

```json
{
  "temperature": 28.4,
  "conditions": "Partly cloudy",
  "humidity": 41,
  "windSpeed": 12.6
}
```

### get_forecast example response

```json
{
  "forecast": [
    {
      "date": "2026-08-01",
      "minTemp": 21.1,
      "maxTemp": 30.3,
      "conditions": "Partly cloudy"
    },
    {
      "date": "2026-08-02",
      "minTemp": 20.4,
      "maxTemp": 31,
      "conditions": "Sunny"
    },
    {
      "date": "2026-08-03",
      "minTemp": 22,
      "maxTemp": 29.8,
      "conditions": "Light rain"
    }
  ]
}
```

### compare_weather example response

```json
{
  "city1": {
    "temperature": 28.4,
    "conditions": "Partly cloudy",
    "humidity": 41,
    "windSpeed": 12.6
  },
  "city2": {
    "temperature": 27.8,
    "conditions": "Sunny",
    "humidity": 38,
    "windSpeed": 11.2
  }
}
```
