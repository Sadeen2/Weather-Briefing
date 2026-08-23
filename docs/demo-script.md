# Cirra — Weather Briefing MCP Demo Script

## Demo Duration: 3–5 minutes

### 0:00–0:40 — The Problem

**Goal:** Explain the problem and why Cirra exists.

**Talking points:**

Weather information is easy to access, but users usually need to leave their AI assistant and open a separate weather application or website.

Cirra solves this by exposing practical weather capabilities directly through the Model Context Protocol (MCP).

Instead of manually navigating a weather website, an AI assistant can call Cirra tools to search for locations, retrieve weather data, generate forecasts, compare cities, and produce concise weather briefings.

**Key message:**

> Cirra turns weather data into AI-accessible tools that can be used directly inside an assistant.

---

### 0:40–1:10 — Architecture

**Show the architecture slide.**

**Talking points:**

Cirra is a TypeScript MCP server running over stdio.

The AI assistant communicates with the MCP server, which exposes eight weather-related tools.

For live data, Cirra uses Open-Meteo for geocoding and weather information.

The server also includes local fixture data, so important flows can continue working when the live weather service is unavailable.

The main Demo Day tools are:

- `search_city`
- `get_weather`
- `create_weather_briefing`

---

### 1:10–2:00 — Live Demo 1: Current Weather

**Prompt:**

> What is the weather in Hebron right now?

**Expected tool:**

`get_weather`

**What to demonstrate:**

1. Enter the prompt.
2. Show that the assistant identifies the `get_weather` tool.
3. Show the tool input:
   ```json
   {
     "city": "Hebron"
   }
   ```
4. Run the tool.
5. Show the returned weather information.
6. Explain that the user receives a natural-language answer instead of raw API data.

**Transition:**

> This is the basic case: one natural-language request maps directly to a dedicated MCP tool.

---

### 2:00–3:00 — Live Demo 2: Practical Weather Briefing

**Prompt:**

> I'm planning my next few days in Hebron. Give me a 3-day weather briefing in Celsius.

**Expected tool:**

`create_weather_briefing`

**Expected input:**

```json
{
  "location": "Hebron",
  "days": 3,
  "units": "celsius"
}
```

**What to demonstrate:**

1. Enter the natural-language request.
2. Show that the assistant selects `create_weather_briefing`.
3. Run the tool.
4. Show that the result combines weather information into a concise, practical briefing.
5. Highlight that the user does not need to manually request separate weather and forecast calls.

**Key message:**

> Instead of exposing raw weather data, Cirra can provide a useful summary designed around the user's intent.

---

### 3:00–3:30 — Reliability and Safety

Briefly highlight the engineering work behind the demo.

**Mention:**

- Input validation for model-supplied arguments.
- Forecast requests limited to 1–7 days.
- HTTPS-only Open-Meteo requests.
- Approved-host allowlisting.
- Network timeouts.
- Controlled MCP error responses.
- Fixed fixture paths.
- Local fixture fallback when live weather data is unavailable.
- Output and collection limits.

**Key message:**

> The project is not only about making the tools work; it also bounds inputs, external requests, filesystem access, and outputs.

---

### 3:30–4:30 — What We Would Build Next

**Talking points:**

Future improvements could include:

1. User accounts and cloud synchronization for favorite cities.
2. More advanced weather alerts and notifications.
3. Historical weather and trend analysis.
4. More personalized recommendations based on user preferences.
5. Deployment as a hosted MCP service for easier integration.

**Key message:**

> The current version focuses on reliable city-based weather access through MCP, while leaving room for personalization and production-scale deployment.

---

### 4:30–5:00 — Questions

Finish with:

> That's Cirra — a practical Weather Briefing MCP server that lets AI assistants access structured weather capabilities directly through tools.

Invite questions about the architecture, MCP integration, live data, fallback strategy, or security.

---

## Live Prompt Checklist

### Primary Prompt 1

> What is the weather in Hebron right now?

Tool: `get_weather`

### Primary Prompt 2

> I'm planning my next few days in Hebron. Give me a 3-day weather briefing in Celsius.

Tool: `create_weather_briefing`

### Backup Prompt

> Compare the current weather in Hebron and Ramallah. Which city is warmer?

Tool: `compare_weather`

---

## Backup Plan

If live Open-Meteo data is unavailable:

1. Use the local fixture-backed tool flows.
2. Explain that Cirra includes deterministic local fixture data for important weather flows.
3. Continue the demo using the same tool interface.
4. Do not spend demo time troubleshooting external network connectivity.

---

## Rehearsal Checklist

- [ ] Rehearse the full demo once with a timer.
- [ ] Rehearse the full demo a second time with a timer.
- [ ] Confirm the demo stays under 5 minutes.
- [ ] Confirm MCP Inspector connects successfully.
- [ ] Confirm the two primary prompts work.
- [ ] Keep the backup prompt ready.
- [ ] Confirm the architecture slide can be explained in approximately 30 seconds.
- [ ] Keep the backup/fixture explanation short.
