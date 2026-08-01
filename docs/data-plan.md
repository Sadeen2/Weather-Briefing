# Data Plan — Week 3

This document maps each P0/P1 tool to its data source, fixture fallback, and known failure modes.

## Tools Overview

| Tool | Source | Fixture Path | Auth | Rate Limits | Failure Modes |
|---|---|---|---|---|---|
| `search_city` | Open-Meteo Geocoding API (`https://geocoding-api.open-meteo.com/v1/search`) | `./data/cities.json` | none | ~10,000 req/day (free tier, no key) | empty results (city not found), timeout, HTTP 5xx, malformed query (empty string) |
| `get_weather_alerts` | Derived from Open-Meteo Forecast API `weather_code` field (`https://api.open-meteo.com/v1/forecast`) | `./data/weather-alerts.json` | none | ~10,000 req/day (free tier, no key) | timeout, HTTP 5xx, city not found (invalid coordinates), no active alert conditions (empty result is valid) |

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

## Notes

- No API keys required for either tool (Open-Meteo free tier).
- Both tools use the shared fetchJson helper (src/lib/http.ts) with an 8s timeout.
- Demo Day rule: if Wi-Fi is down, both tools fall back to their local fixture file in ./data/.