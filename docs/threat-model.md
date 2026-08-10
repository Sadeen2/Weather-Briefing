# Threat Model — Weather Briefing MCP

## Assets

- API responses from Open-Meteo (geocoding + weather/alerts data) — no sensitive data, but should not be tampered with or exposed unnecessarily.
- `./data` fixture files (`cities.json`, `weather-alerts.json`) — static, read-only reference data bundled with the project.
- Tokens/API keys: **none**. Open-Meteo requires no authentication key for the endpoints this project uses.
- The host machine's filesystem — not directly exposed by any tool, and must stay that way.

## Trust boundaries

- **Model → tool arguments**: every argument passed to `search_city` and `get_weather_alerts` comes from the model, not a trusted human, and is treated as untrusted input.
- **Tool → network**: both tools make outbound HTTP requests to fixed Open-Meteo domains (`geocoding-api.open-meteo.com`, `api.open-meteo.com`). The domain itself is hardcoded; only query parameters are user-influenced.
- **Tool → filesystem**: `search_city` and `get_weather_alerts` read static, build-time-imported fixture files (`data/cities.json`, `data/weather-alerts.json`) as fallback. No dynamic/user-controlled file paths are constructed anywhere.

## P0 Tool Risk Map

This map lists the project's P0 tools and their high-level risk surface. Treat tool arguments like untrusted HTTP input: validate and bound all values before use.

### search_city
- User-controlled input: `city` (string provided by the caller/model).
- Network access: Open-Meteo Geocoding API (`https://geocoding-api.open-meteo.com/v1/search`). The live request includes `count=5` (live results are capped).
- Disk/filesystem access: reads the local `data/cities.json` fallback fixture when the live API call fails.
- Relevant security risks:
	- Runaway responses from uncapped fallback results (fixture filtering currently returns all matches without a cap).
	- Raw user input appearing in logs (logged on failure via `console.error`).
	- Third-party API availability and malformed responses.
	- SSRF: currently low because the API domain and URL are hardcoded in the implementation.

### get_weather
- Tool arguments: `city` originates from the model and must be treated as untrusted input; resolving the city uses `search_city` internally.
- Network access: Open-Meteo current weather API (`https://api.open-meteo.com/v1/forecast`) via `getWeatherData`.
- Disk/filesystem access: the implementation falls back to local fixtures (e.g. `data/get-weather-fixture.json`) when live requests fail.
- Relevant security risks:
	- Invalid or unexpected model-supplied arguments (e.g., malformed or extreme coordinate values produced by a resolver).
	- Third-party API failure or malformed payloads.
	- Unexpectedly large or runaway responses from fixture fallback paths or unbounded aggregation logic.

### create_weather_briefing
- User-controlled / model-controlled arguments: `location`, `days`, and `units` (all are caller-supplied and must be validated).
- Network access: uses `search_city`, `getWeatherData`, and `getForecastData`, so it depends on Open-Meteo geocoding and forecast endpoints for live data.
- Disk/filesystem access: reads `data/create-weather-briefing-fixture.json` as a fallback when live data is unavailable.
- Relevant security risks:
	- Invalid model-supplied input (e.g., empty or non-printable `location`, out-of-range `days`). Note: `createWeatherBriefingData` normalizes and bounds `days` to 1–7.
	- Oversized/runaway responses when assembling briefing content from large fixture entries or unbounded collections.
	- Dependency failures cascading from `search_city` or the Open-Meteo endpoints.

## Threat Coverage

Treat tool arguments like untrusted HTTP input: validate, bound, and sanitize before use.

- **Path traversal:** Risk is low. No tool constructs filesystem paths from user-controlled input; fixture file access uses fixed filenames and resolved data directory checks.
- **SSRF:** Risk is low. Outbound Open-Meteo domains and request URLs are hardcoded; callers cannot supply an arbitrary URL today.
- **Secret leaks:** Risk is low for API keys — Open-Meteo endpoints used here require no authentication. However, raw user input is logged in several failure paths and should be sanitized/truncated to avoid accidental exposure of sensitive user-supplied content.
- **Runaway responses:** Relevant and actionable. Uncapped fixture filtering (e.g., `search_city` fallback) and any aggregation/collection without explicit size limits can produce very large responses; implement caps and result-size limits.

## Top 5 risks

1. **Unbounded fixture fallback in `search_city`** — when the live Open-Meteo call fails, the tool falls back to filtering a local fixture list with no result cap. **Confirmed via live testing**: querying `city: "a"` triggered the fallback and returned an unfiltered list of cities before the fix.
2. **Weaker input validation on `get_weather_alerts`** — `location` was validated only with `min(1).max(100)` in Zod, without the character-restricting regex used in `search_city`. **Confirmed via live testing**: `location: "Hebronn"` (typo) previously failed the exact-match lookup and silently returned an empty alerts array.
3. **Raw input logged verbatim** — both tools log the caller-supplied string directly via `console.error` on failure (e.g. `failed for "a"`, `failed for "Hebronn"`). **Confirmed via live testing.** Not a secret leak (no keys involved), but unnecessary exposure of raw input in logs. Not fixed this week (see Mitigations).
4. **Third-party API availability** — both tools depend entirely on Open-Meteo's uptime. A fetch timeout is already implemented — `fetchJson` uses `AbortSignal.timeout(timeoutMs)` with an 8-second default — so hanging requests are bounded. This is a design strength, not a gap.
5. **SSRF surface (low, but present)** — the request domain is hardcoded in both tools, so classic SSRF isn't exploitable today. **Confirmed via static code review** and via live testing (malicious-looking URL strings like `https://evil.example` are rejected by input validation before ever reaching a fetch call).

## Mitigations this week

1. **Implemented & tested** — Added a result cap (`MAX_FALLBACK_RESULTS = 5`) to the fixture fallback path in `search_city`, matching the live-results cap. The response now includes a `note` stating how many results were truncated (e.g. "Showing 5 of 6 matches"). Verified live: `city: "a"` now returns exactly 5 results with a truncation note, instead of an unbounded list.
2. **Implemented & tested** — Aligned `get_weather_alerts`'s Zod schema with `search_city`'s character-restricting regex (`/^[\p{L}\p{M}]+(?:[ '\-’][\p{L}\p{M}]+)*$/u`). Verified live: inputs like `"Hebron123"` are now rejected with a clear validation error before reaching the lookup logic.
3. **Verified via live testing (not yet fixed)** — Re-tested both tools against path-traversal-style strings (`../../etc/passwd`), URL-style strings (`https://evil.example`), and long strings (150+ chars). All six combinations were cleanly rejected by the tightened Zod regex/length checks, with no silent acceptance.
4. **Not changed this week** — the 8-second `AbortSignal.timeout()` in `http.ts` was already in place and required no fix.
5. **By design, documented** — the Open-Meteo domain remains hardcoded (not configurable via input) in both tools; this is treated as the de facto allowlist / SSRF mitigation.

## Out of scope

- **Authentication/authorization of MCP clients**: this is a student project running locally via Claude Desktop; multi-user access control is not implemented and is acceptable for this scope.
- **Rate limiting on our side**: we rely on Open-Meteo's own rate limiting; adding a client-side rate limiter is not a priority this week given low expected traffic.
- **Secrets management (vault, key rotation)**: not applicable, since no API keys or secrets are used by this project's current tools.
- **Sanitizing raw input out of error logs**: identified as Risk #3 but not fixed this week; planned as a follow-up (log a generic message instead of the raw string).
- **Full path traversal hardening for file tools**: not applicable this week, since no tool constructs file paths from user input; will be revisited if such a tool is added later.