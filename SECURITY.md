# Security Policy

## Supported Versions

The latest version of this Weather Briefing MCP repository is currently supported.

## Reporting a Security Issue

Please report security issues privately to the project mentor instead of opening a public GitHub issue.

Mentor email: [Mohammad Jaradat ...]

## Security Hardening

Week 4 security hardening includes:

- Bounded and validated city inputs.
- Forecast days limited to 1–7.
- Outbound requests restricted to approved Open-Meteo hosts.
- HTTPS-only network requests.
- Network requests protected with timeouts.
- Safe local fixture fallback.
- Short and safe tool error messages without stack traces or internal paths.
- Environment and secret files excluded through `.gitignore`.
- No API keys or environment values exposed in tool responses or logs.

### Hardened Tools

- `get_weather`
- `get_forecast`
- `compare_weather`
- `create_weather_briefing`
