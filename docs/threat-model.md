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