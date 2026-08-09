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

## Top 5 risks

1. **Unbounded fixture fallback in `search_city`** — when the live Open-Meteo call fails, the tool falls back to filtering a local fixture list with no result cap. **Confirmed via live testing**: querying `city: "a"` triggered the fallback and returned an unfiltered list of cities (Ramallah, Nablus, Gaza, Amman, Cairo...) — a runaway response risk.
2. **Weaker input validation on `get_weather_alerts`** — `location` is validated only with `min(1).max(100)` in Zod, without the character-restricting regex used in `search_city`. Impact is limited because the raw string is never sent directly in a URL — it's matched via strict equality against a static city list. **Confirmed via live testing**: `location: "Hebronn"` (typo) failed the exact-match lookup and silently returned an empty alerts array, with no indication to the caller that the name didn't match.
3. **Raw input logged verbatim** — both tools log the caller-supplied string directly via `console.error` on failure (e.g. `failed for "a"`, `failed for "Hebronn"`). **Confirmed via live testing** in both test runs above. Not a secret leak (no keys involved), but unnecessary exposure of raw input in logs.
4. **Third-party API availability** — both tools depend entirely on Open-Meteo's uptime. *(Note: a fetch timeout is already implemented — `fetchJson` uses `AbortSignal.timeout(timeoutMs)` with an 8-second default — so hanging requests are bounded. This is a design strength, not a gap.)*
5. **SSRF surface (low, but present)** — the request domain is currently hardcoded in both tools, so classic SSRF isn't exploitable today. **Confirmed via static code review.** Worth monitoring if the base URL is ever made configurable or input-driven.

## Mitigations this week

1. Add an explicit result cap (e.g., max 5) to the fixture fallback path in `search_city`, matching the live-results cap already used on the live path.
2. Align `get_weather_alerts`'s Zod schema with `search_city`'s character-restricting regex for consistency, and return a clearer "not found" signal instead of a silent empty array.
3. Avoid logging raw user input directly; log a generic message or a truncated/sanitized version instead.
4. Keep the existing 8-second `AbortSignal.timeout()` on both `fetch` calls — already in place in `http.ts`, no change needed.
5. Keep the Open-Meteo domain hardcoded (not configurable via input) — document this explicitly as a deliberate SSRF mitigation.

## Out of scope

- **Authentication/authorization of MCP clients**: this is a student project running locally via Claude Desktop; multi-user access control is not implemented and is acceptable for this scope.
- **Rate limiting on our side**: we rely on Open-Meteo's own rate limiting; adding a client-side rate limiter is not a priority this week given low expected traffic.
- **Secrets management (vault, key rotation)**: not applicable, since no API keys or secrets are used by this project's current tools.
- **Full path traversal hardening**: not applicable this week, since no tool constructs file paths from user input; will be revisited if such a tool is added later.