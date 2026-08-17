# Manual Test Plan — Week 5

Owner: Duaa
Tools covered: `search_city`, `get_weather_alerts`
Branch: `week-5-docs`

Test cases below cover: one happy path, one invalid-input case, one empty-data
case, and one timeout/offline case per tool (8 total).

| id | tool | setup | input | expected | result | evidence |
|----|------|-------|-------|----------|--------|----------|
| TC-01 | search_city | Normal network, live API reachable | `city: "Ramallah"` | `source: "live"`, returns at least one result with correct `name`, `latitude`, `longitude`, `country`, `timezone` for Ramallah, Palestine | PASS | docs/evidence/TC-01-happy-path.png |
| TC-02 | search_city | Normal network | `city: "Ramallah123!"` (contains digits/symbols, violates the letters-only regex) | Zod validation rejects the input before the tool runs; returns a validation error, no API call made | PASS | docs/evidence/TC-02-invalid-input.png |
| TC-03 | search_city | Normal network, live API reachable, query has no matches | `city: "Xzqqplonk"` (nonsense string, no real city) | `source: "live"`, `results: []` (empty array), no crash | PASS | docs/evidence/TC-03-empty-data.png |
| TC-04 | search_city | Simulate offline/timeout — disconnect network or block the Open-Meteo host before calling | `city: "Nablus"` | Falls back to `source: "fixture"`; returns fixture matches from `data/cities.json` if any exist, plus a `note` explaining live API was unavailable | PASS | docs/evidence/TC-04-offline-fixture.png |
| TC-05 | get_weather_alerts | Normal network, live API reachable. Location MUST exist (exact name match, case-insensitive) in `data/cities.json`, or the tool throws internally and silently falls back to fixture instead of testing the live path | `location: "Ramallah"` (must match an entry in `data/cities.json`) | `source: "live"`; returns `alerts` array — populated if today's weather code matches `ALERT_CODE_MAP`, otherwise empty array; no error either way | PASS | docs/evidence/TC-05-TC-07-live-empty.png |
| TC-06 | get_weather_alerts | Normal network | `location: "Ramallah99"` (contains digits, violates the letters-only regex) | Zod validation rejects the input before the tool runs; returns a validation error, no API call made | PASS | docs/evidence/TC-06-invalid-input.png |
| TC-07 | get_weather_alerts | Normal network, live API reachable. Pick a city from `data/cities.json` where today's live weather code does NOT match any code in `ALERT_CODE_MAP` | Same known city as TC-05, run when no matching alert condition is active | `source: "live"`, `alerts: []` (empty array), no crash — this is the "empty data" case, distinct from TC-05 only in whether an alert condition was active | PASS | Same run as TC-05 — docs/evidence/TC-05-TC-07-live-empty.png |
| TC-08 | get_weather_alerts | Simulate offline/timeout — disconnect network or block `api.open-meteo.com` before calling | `location: "Nablus"` (must exist in `data/cities.json` for the fixture filter to have a chance of matching) | Falls back to `source: "fixture"`; returns `alerts` filtered from `data/weather-alerts.json` for that city (or `[]` if none), plus a `note` explaining live API was unavailable — no crash/hang | PASS | docs/evidence/TC-08-offline-fixture.png |

**Result: 8/8 PASS.** No code fixes were required — all cases matched expected
behavior on the first run.

## Notes

- Fixture reset: `data/cities.json` is read-only during these tests; no reset
  needed since `search_city` only reads from it, never writes to it.
- To simulate offline/timeout (TC-04, TC-08): temporarily block
  `geocoding-api.open-meteo.com` / `api.open-meteo.com` in the hosts file, or
  disconnect Wi-Fi, then run the case in Inspector.
- Confirmed from `weather-alerts.ts`: it DOES have a fixture fallback
  (`data/weather-alerts.json`), same pattern as `search_city`.
- Before running TC-05/TC-07/TC-08, open `data/cities.json` and pick a real
  city name from that fixture list — `getWeatherAlerts` looks up the location
  by exact (case-insensitive) name match against that file. If the name isn't
  found there, the function throws internally and always falls back to fixture,
  even with a live network — so an "unknown city" input never actually
  exercises the live path.
- **Potential bug worth flagging in the checklist**: an unrecognized city name
  (e.g. a typo, or a real city just missing from `cities.json`) is currently
  indistinguishable from an offline/timeout failure — both silently return
  `source: "fixture"`. This may be worth a follow-up ticket, since a user
  typo will look like an API outage instead of a "city not found" message.
- TC-05 and TC-07 were satisfied by the same Inspector run: at test time,
  Ramallah's live weather code did not match any entry in `ALERT_CODE_MAP`,
  so the live call itself returned an empty `alerts` array — proving both
  "live path works" and "empty result handled cleanly" in one screenshot.