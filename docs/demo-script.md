# Demo Script — Weather Briefing MCP (Cirra)

**Total time: 5:00 minutes**
**Presenters: Duaa Naji & Sadeen Ryahi**

---

## 0:00–0:40 — The Problem (40s)

**Speaker: Duaa**

> "Getting weather information usually means switching to a separate app or
> browser tab. Cirra brings that directly into an AI assistant's
> conversation. It's a Model Context Protocol server with 8 tools covering
> city search, live conditions, forecasts, comparisons, alerts, favorite
> cities, and practical weather briefings — all backed by live Open-Meteo
> data with a local fallback if the connection drops."

---

## 0:40–1:10 — Architecture (30s, one slide)

**Speaker: Sadeen**

One slide showing:
```
User → Claude / MCP Client → Cirra (TypeScript, stdio)
                                 ├─ Zod input validation
                                 ├─ Open-Meteo (live)
                                 └─ Local fixtures (fallback)
```
Mention briefly: input validation on every tool, HTTPS-only host allowlist,
9s network timeout, and local fixture fallback for demo reliability.

---

## 1:10–3:30 — Live Tool Calls (2:20, the core of the demo)

**Speaker(s): Duaa runs Prompt A, Sadeen runs Prompt B — narrate what
each tool call is doing as it happens**

### Prompt A (primary — guaranteed to work)
```
What is the weather in Hebron, and should I carry an umbrella tomorrow?
```
Expected: chains `get_weather` → `create_weather_briefing` (Rawand's +
Sadeen's tools), ending in a natural-language recommendation.

### Prompt B (covers more tools — combined P0/P1 flow)
```
Using the weather-briefing MCP project tools, I need a complete weather
report for Hebron: find the city coordinates, check current conditions,
get a 3-day forecast, compare it with Ramallah, check for any weather
alerts, and give me a practical briefing on whether I should carry an
umbrella. Please save Hebron as a favorite city and show me my saved
favorites too.
```
Expected: chains 7 of 8 tools in one request — `search_city`, `get_weather`,
`get_forecast`, `compare_weather`, `get_weather_alerts`, `save_favorite_city`,
`list_favorite_cities`.

### Security example (short, ~15s)
```
Use search_city to search for Hebron123!
```
Expected: clean validation rejection — "City name must contain letters
only" — no stack trace, no internal error details.

### Backup prompt (if live API / Wi-Fi fails)
```
Search for Nablus.
```
With Wi-Fi off — demonstrates automatic fixture fallback (`source:
"fixture"`), so the demo still works offline.

---

## 3:30–4:30 — What's Next (1:00)

**Speaker: Sadeen**

Pick 2–3 realistic next steps, e.g.:
- A lightweight mobile or web client instead of relying on a chat interface
- Caching recent lookups to cut down on repeated live API calls
- Expanding fixture coverage to more cities for offline reliability
- Multi-language support for city names and briefings

---

## 4:30–5:00 — Questions (0:30)

Open floor. Be ready to explain:
- Why the letters-only regex on city names (prevents injection / path traversal)
- The `country: "unknown"` behavior for some cities (Open-Meteo data gap,
  not a bug — see README "Known Notes")
- What happens if the live API is down (fixture fallback, documented and
  tested in `docs/test-plan.md`)

---

## Backup Plan (if Wi-Fi fails entirely)

1. Turn off Wi-Fi deliberately before Prompt A or B.
2. Use the backup prompt ("Search for Nablus") to show the fixture fallback
   working — this turns a potential failure into a planned feature
   demonstration.
3. If Inspector/Claude Desktop itself won't start, fall back to showing
   the pre-recorded screen capture (see rehearsal notes below).

---

## Rehearsal Notes

- [ ] Rehearsed twice with a timer, total time under 5:00
- [ ] Repo checked out at tag `v1.0.0` before rehearsal
- [ ] Server/Inspector tested fresh that same day
- [ ] Screen recording or screenshots saved as fallback evidence
- [ ] Each speaker (Duaa, Sadeen) knows their exact section and cue to
      hand off