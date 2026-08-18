# Security Policy

## Supported Versions

The latest version of this Weather Briefing MCP repository is currently supported.

## Reporting a Security Issue

Please report security issues privately to the project mentor instead of opening a public GitHub issue.

Mentor email: [Mohammad Jaradat ...  ]

## Security Hardening

Week 4 security hardening across the project's tools includes:

- Bounded and validated inputs across all tools (city/location character restrictions, length caps, forecast days limited to 1–7).
- Fixture fallback results capped to a fixed maximum in `search_city`, with truncation noted in the response.
- Outbound requests restricted to approved Open-Meteo hosts.
- HTTPS-only network requests.
- Network requests protected with an 8-second timeout.
- Safe local fixture fallback when live API calls are unavailable.
- Short and safe tool error messages without raw user input, stack traces, or internal paths.
- Environment and secret files excluded through `.gitignore`; `.env.example` provided.
- No API keys or environment values exposed in tool responses or logs (project currently uses no API keys).

### Hardened Tools

- `search_city` — input validation tightened, fixture fallback capped, error logs sanitized.
- `get_weather_alerts` — input validation aligned with `search_city`, error logs sanitized.
- `get_weather`
- `get_forecast`
- `compare_weather`
- `create_weather_briefing`