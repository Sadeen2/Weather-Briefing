# Demo Script — Weather Briefing MCP (Cirra)

**Task:** 6.3 Demo Script (3–5 minutes)  
**Presenter:** **Rawand Bawatneh**  
**Project:** Weather Briefing MCP — Cirra  
**Slides:** Shared Cirra team slides (title, problem, architecture, tools, next steps)

---

## 0:00–0:40 — Problem

**Speaker: Rawand**

> “People often need quick weather information without opening multiple apps. Cirra is a Weather Briefing MCP server that provides current weather, forecasts, comparisons, alerts, and practical weather briefings through MCP tools.”

---

## 0:40–1:10 — Architecture

**Speaker: Rawand**

> “Cirra is built with TypeScript and MCP tools. It validates inputs with Zod, resolves city names, retrieves live data from Open-Meteo over HTTPS, and uses local fixture data as an offline fallback if the API or Wi-Fi is unavailable.”

**Show:** one architecture slide only.

---

## 1:10–2:20 — Live Tool 1

**Speaker: Rawand**

**Tool:** `get_weather`

**Input:**

```json
{
  "city": "Hebron"
}
```

**Expected result:**  
Current temperature, conditions, humidity, and wind speed for Hebron.

**What I say after the result:**

> “Here I used `get_weather` with only the city name. The tool resolves the city internally and returns the current weather in a structured response.”

---

## 2:20–3:30 — Live Tool 2

**Speaker: Rawand**

**Tool:** `compare_weather`

**Input:**

```json
{
  "city1": "Hebron",
  "city2": "Amman"
}
```

**Expected result:**  
A structured comparison of the current weather in Hebron and Amman.

**What I say after the result:**

> “This tool compares the current weather in two cities in one response, so the user does not need to check each city separately.”

---

## 3:30–4:20 — What I’d Build Next

**Speaker: Rawand**

> “Next, I would improve location disambiguation, add richer severe-weather notifications, and connect favorites to persistent user storage instead of local-only storage.”

---

## 4:20–4:40 — Backup Plan

**Speaker: Rawand**

> “If the Wi-Fi or Open-Meteo API fails, I can use the local fixture fallback, so the demo can still return predictable weather data offline.”

### Backup Tool

**Tool:** `get_forecast`

**Input:**

```json
{
  "city": "Hebron",
  "days": 2
}
```

**Expected result:**  
A two-day weather forecast for Hebron.

---

## 4:40–5:00 — Close / Questions

**Speaker: Rawand**

> “That is Cirra: a small MCP server that turns weather data into quick, useful results. Thank you — I’m ready for questions.”

---

## Rehearsal Checklist

- Keep the demo under **5:00 minutes**.
- Run **exactly two live tools**.
- Keep the backup tool ready, but do not run it unless needed.
- Use the shared Cirra slides and avoid reading long text from them.
- If time runs long, shorten the architecture explanation — do not cut the live demo.
