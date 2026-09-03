# Weather Briefing MCP — Cirra

Cirra is a **Weather Briefing MCP (Model Context Protocol) Server** that gives AI assistants direct access to useful weather information without requiring users to open a separate weather application or browser tab.

The server can:

* Search for cities and resolve their geographic coordinates.
* Retrieve current weather conditions.
* Return multi-day weather forecasts.
* Compare weather between two cities.
* Generate short, practical weather briefings.
* Return available weather alerts.
* Save favorite cities locally.
* List previously saved favorite cities.

Cirra uses **Open-Meteo** for live geocoding and weather data and includes local fixture data so important tool flows can continue to work when the live weather service is unavailable.

---

## Requirements

Before running the project, make sure the following are installed:

* **Node.js 20 or newer**
* **npm**
* Internet access for live Open-Meteo data
* A terminal or command-line environment

Check your versions with:

```bash
node --version
npm --version
```

---

## Install

Clone the repository:

```bash
git clone https://github.com/Sadeen2/Weather-Briefing.git
```

Move into the project directory:

```bash
cd Weather-Briefing
```

Install the project dependencies:

```bash
npm install
```

No weather API key is required.

The Open-Meteo endpoints used by this project are publicly accessible and do not require authentication credentials.

---

## Run the MCP Server

Start the MCP server in development mode:

```bash
npm run dev
```

The server runs over **stdio** using TypeScript and `tsx`.

Stop the server with:

```text
Ctrl+C
```

---

## Test with MCP Inspector

The recommended way to manually inspect and test the MCP tools is with the MCP Inspector.

From the project root, run:

```bash
npx @modelcontextprotocol/inspector npx tsx src/index.ts
```

The Inspector will print a local URL in the terminal.

Open that URL in your browser.

Use the following connection settings:

```text
Transport Type: STDIO
Command: npx
Arguments: tsx src/index.ts
```

Connect to the server, open the **Tools** tab, and select **List Tools**.

You should see the registered Cirra MCP tools.

You can then select a tool, provide its input, and choose **Run Tool**.

---

# Tools

The server currently contains **eight MCP tools**.

| Tool                      | Description                                                      | Main Input                                    | Priority |
| ------------------------- | ---------------------------------------------------------------- | --------------------------------------------- | -------- |
| `search_city`             | Resolves a city name to geographic coordinates.                  | `city`                                        | P0       |
| `get_weather`             | Returns current weather conditions for a city.                   | `city`                                        | P0       |
| `create_weather_briefing` | Creates a short practical weather briefing with recommendations. | `location`, optional `days`, optional `units` | P0       |
| `get_forecast`            | Returns a multi-day weather forecast for a city.                 | `city`, `days`                                | P1       |
| `compare_weather`         | Compares current weather conditions between two cities.          | `city1`, `city2`                              | P1       |
| `save_favorite_city`      | Saves a city locally as a favorite.                              | `city`                                        | P1       |
| `list_favorite_cities`    | Returns locally saved favorite cities.                           | None                                          | P1       |
| `get_weather_alerts`      | Returns available weather warnings or alerts for a location.     | `location`                                    | P1       |

The main P0 Demo Day tools are:

* `search_city`
* `get_weather`
* `create_weather_briefing`

---

# Example Prompts

After connecting the MCP server to an MCP-compatible assistant, users can ask natural-language questions such as:

### Current Weather

```text
What is the current weather in Hebron?
```

The assistant can call:

```text
get_weather
```

with:

```json
{
  "city": "Hebron"
}
```

---

### Weather Forecast

```text
What will the weather be like in Ramallah for the next 3 days?
```

The assistant can call:

```text
get_forecast
```

with:

```json
{
  "city": "Ramallah",
  "days": 3
}
```

---

### Weather Comparison

```text
Compare the current weather in Hebron and Nablus.
```

The assistant can call:

```text
compare_weather
```

with:

```json
{
  "city1": "Hebron",
  "city2": "Nablus"
}
```

---

### Practical Weather Briefing

```text
Give me a weather briefing for Hebron and tell me if I should carry an umbrella.
```

The assistant can call:

```text
create_weather_briefing
```

with:

```json
{
  "location": "Hebron",
  "days": 1,
  "units": "celsius"
}
```

---

### Search for a City

```text
Find the coordinates for Ramallah.
```

The assistant can call:

```text
search_city
```

with:

```json
{
  "city": "Ramallah"
}
```

---

### Weather Alerts

```text
Are there any weather alerts for Ramallah?
```

The assistant can call:

```text
get_weather_alerts
```

with:

```json
{
  "location": "Ramallah"
}
```

---

### Save a Favorite City

```text
Save Hebron as one of my favorite cities.
```

The assistant can call:

```text
save_favorite_city
```

with:

```json
{
  "city": "Hebron"
}
```

---

### List Favorite Cities

```text
Show me my favorite cities.
```

The assistant can call:

```text
list_favorite_cities
```

---

# Common Demo Flow

A typical Demo Day request is:

> What is the weather in Hebron, and should I carry an umbrella tomorrow?

Cirra can combine several tools to answer the request:

1. `search_city` resolves the requested location when required.
2. `get_weather` retrieves the current conditions.
3. `get_forecast` retrieves upcoming forecast data.
4. `create_weather_briefing` converts the weather data into a short practical recommendation.

City-based tools accept **city names**, so users do not need to manually provide latitude or longitude values.

---

# Troubleshooting

## 1. MCP Inspector Does Not Connect

Make sure you are running the Inspector from the project root:

```bash
npx @modelcontextprotocol/inspector npx tsx src/index.ts
```

Verify that the Inspector is configured with:

```text
Transport Type: STDIO
Command: npx
Arguments: tsx src/index.ts
```

Also confirm that dependencies were installed:

```bash
npm install
```

If necessary, stop the Inspector with `Ctrl+C` and start it again.

---

## 2. MCP Inspector Port Is Already in Use

If the Inspector reports that one of its ports is already in use, another Inspector process may still be running.

Close old Inspector terminals or processes and start it again:

```bash
npx @modelcontextprotocol/inspector npx tsx src/index.ts
```

Only one Inspector instance should use the same local port at a time.

---

## 3. Live Weather Data Is Unavailable

Cirra depends on Open-Meteo for live geocoding and weather data.

If the internet connection is unavailable or the Open-Meteo service cannot be reached, supported tool flows can use local fixture data.

Fixture files are located under:

```text
data/
```

For example:

```text
data/cities.json
data/get-weather-fixture.json
data/get-forecast-fixture.json
data/compare-weather-fixture.json
data/create-weather-briefing-fixture.json
data/weather-alerts.json
```

The application also applies network timeouts so unavailable external services do not leave requests waiting indefinitely.

---

# Input Validation

All MCP tool arguments are treated as untrusted input.

Shared validation helpers are located in:

```text
src/lib/validation.ts
```

City-based tools validate city names before performing weather or geocoding operations.

City names are:

* Trimmed before validation.
* Required to contain at least one character.
* Limited to a maximum of **100 characters**.
* Restricted to letters, spaces, periods, apostrophes, and hyphens.

Valid examples include:

```text
Hebron
Ramallah
New York
St. Louis
```

An invalid input such as:

```text
../etc/passwd
```

is rejected by validation before it can be processed as a city.

---

# Forecast Limits

Forecast requests are bounded to prevent unexpectedly large requests.

The number of requested forecast days must be:

```text
1–7
```

The value must be a whole number.

Example:

```json
{
  "city": "Hebron",
  "days": 3
}
```

---

# Live Weather and Geocoding Data

Cirra uses Open-Meteo for live weather and location data.

Outbound requests are restricted to these approved hosts:

```text
geocoding-api.open-meteo.com
api.open-meteo.com
```

Requests must use HTTPS.

Users cannot provide an arbitrary external API URL.

This limits the external request surface and reduces SSRF-related risk.

---

# Network Timeouts

External weather requests use a bounded timeout.

Current timeout:

```text
9000 ms
```

Requests that exceed the allowed time are handled as controlled failures instead of waiting indefinitely.

---

# Offline Fixture Fallback

Cirra includes local fixtures so important flows can continue to behave predictably during demonstrations or temporary Open-Meteo outages.

Fixture files are stored under:

```text
data/
```

Current weather-related fixtures include:

```text
cities.json
compare-weather-fixture.json
create-weather-briefing-fixture.json
get-forecast-fixture.json
get-weather-fixture.json
weather-alerts.json
```

Weather, forecast, briefing, comparison, and alert data use local fallback behavior where supported.

Fixture data is validated before it is trusted by the application.

Fixture paths are controlled by the application and are not created from user-provided city names.

---

# Error Handling

Cirra uses controlled MCP responses instead of exposing raw internal exceptions directly to users.

The implementation is designed to avoid exposing:

* Stack traces
* Local filesystem paths
* Raw third-party API errors
* Internal exception objects
* Internal implementation details

Common lower-level network errors are normalized into controlled errors such as:

```text
WEATHER_API_ERROR
REQUEST_TIMEOUT
```

Tool handlers use shared MCP response helpers for safe responses.

---

# Filesystem Safety

Weather fixture paths are not constructed from model-supplied city names.

Fixture filenames are controlled by the application and resolved within the project's `data/` directory.

The data layer validates resolved paths before reading fixture files.

This helps prevent user-controlled path traversal through the weather tools.

---

# Output and Collection Limits

The project applies several bounds to keep tool behavior predictable.

| Limit            |        Maximum |
| ---------------- | -------------: |
| Forecast days    |              7 |
| Favorite cities  |             25 |
| Weather alerts   |              5 |
| City name length | 100 characters |

These limits help prevent unexpectedly large requests and responses.

---

# Favorite Cities

Cirra supports locally stored favorite cities through:

```text
save_favorite_city
list_favorite_cities
```

Favorite-city storage:

* Is local only.
* Does not require user authentication.
* Does not use cloud storage.
* Normalizes city names.
* Avoids duplicate entries.
* Limits the number of stored favorite cities.
* Uses a fixed local storage path inside the project's data directory.

The project does not currently provide cross-device synchronization or user accounts for favorite cities.

---

# Security

Security hardening includes:

* Shared bounded input validation.
* City-name length limits.
* Character restrictions on location input.
* Forecast-day limits.
* HTTPS-only weather requests.
* Approved Open-Meteo host allowlisting.
* Network request timeouts.
* Controlled MCP error responses.
* Fixed fixture paths.
* Data-directory path checks.
* Output and collection limits.
* Local fixture fallback.
* Threat-model documentation.
* External peer review.

Security-related files include:

```text
SECURITY.md
.env.example
.gitignore
docs/threat-model.md
docs/review-checklist.md
```

The Open-Meteo services used by Cirra do **not** require API credentials.

Sensitive local configuration should never be committed to the repository.

---

# Manual Testing

Manual testing is performed with MCP Inspector.

The Week 5 test plan is documented in:

```text
docs/test-plan.md
```

The manual tests cover areas including:

* Happy-path tool calls
* Invalid input
* Validation rejection
* Empty-data / location-not-found behavior
* Offline behavior
* Local fixture fallback

Captured test evidence is stored under:

```text
docs/evidence/
```

---

# Frontend

The repository also includes a **Cirra frontend dashboard** built as a visual enhancement to the MCP project.

The frontend uses:

* React
* Vite
* Tailwind CSS
* Framer Motion

## Run the Frontend

From the project root:

```bash
cd frontend
npm install
npm run dev
```

Vite will print the local development URL in the terminal.

Open that URL in a browser to view the Cirra interface.

> The frontend is an enhancement to the MCP project. The core MCP server continues to run independently over stdio.

---

# Project Structure

```text
.
├── data/
│   ├── cities.json
│   ├── compare-weather-fixture.json
│   ├── create-weather-briefing-fixture.json
│   ├── get-forecast-fixture.json
│   ├── get-weather-fixture.json
│   ├── weather-alerts.json
│   └── favorite-cities.json
│
├── docs/
│   ├── evidence/
│   ├── data-plan.md
│   ├── design.md
│   ├── project-choice.md
│   ├── review-checklist.md
│   ├── test-plan.md
│   └── threat-model.md
│
├── examples/
│   ├── compare_weather.json
│   ├── create_weather_briefing.json
│   ├── get_forecast.json
│   ├── get_weather.json
│   ├── get_weather_alerts.json
│   ├── list_favorite_cities.json
│   ├── save_favorite_city.json
│   └── search_city.json
│
├── frontend/
│   └── ...
│
├── scripts/
│   ├── check-get-forecast-schema.ts
│   ├── check-get-weather-schema.ts
│   ├── check-weather-briefing.ts
│   └── check-weather-data.ts
│
├── src/
│   ├── index.ts
│   │
│   ├── lib/
│   │   ├── favorites.ts
│   │   ├── http.ts
│   │   ├── mcp-response.ts
│   │   ├── search-city.ts
│   │   ├── validation.ts
│   │   ├── weather-alerts.ts
│   │   ├── weather-briefing.ts
│   │   └── weather-data.ts
│   │
│   ├── schemas/
│   │   ├── compare-weather.ts
│   │   ├── create-weather-briefing.ts
│   │   ├── get-forecast.ts
│   │   ├── get-weather-alerts.ts
│   │   ├── get-weather.ts
│   │   ├── list-favorite-cities.ts
│   │   ├── save-favorite-city.ts
│   │   ├── search-city.ts
│   │   ├── weather-briefing-data.ts
│   │   └── weather-data.ts
│   │
│   └── tools/
│       ├── compare-weather.ts
│       ├── create-weather-briefing.ts
│       ├── get-forecast.ts
│       ├── get-weather-alerts.ts
│       ├── get-weather.ts
│       ├── list-favorite-cities.ts
│       ├── save-favorite-city.ts
│       └── search-city.ts
│
├── .env.example
├── .gitignore
├── SECURITY.md
├── package.json
├── README.md
└── tsconfig.json
```

---

# Project Documentation

Additional project documentation is available under `docs/`.

| Document                   | Purpose                                                                 |
| -------------------------- | ----------------------------------------------------------------------- |
| `docs/project-choice.md`   | Original project choice and problem statement                           |
| `docs/design.md`           | Architecture, tools, priorities, success criteria, and design decisions |
| `docs/data-plan.md`        | Weather data and fixture strategy                                       |
| `docs/threat-model.md`     | Security threats, trust boundaries, risks, and mitigations              |
| `docs/review-checklist.md` | External peer-review findings and follow-up                             |
| `docs/test-plan.md`        | Week 5 manual testing plan and results                                  |
| `docs/evidence/`           | Manual testing screenshots and supporting evidence                      |
| `SECURITY.md`              | Project security guidance                                               |

---
## Example Conversations

See practical MCP usage examples for Rawand Bawatneh's tools:

- [Example Conversations](examples/conversations.md)

# Team Members and Responsibilities

## Rawand Bawatneh

Responsible for:

* `get_weather`
* `get_forecast`
* `compare_weather`

## Duaa Naji

Responsible for:

* `search_city`
* `get_weather_alerts`

## Sadeen Ryahi

Responsible for:

* `create_weather_briefing`
* `save_favorite_city`
* `list_favorite_cities`

---

# Academy

This project was developed as part of the **NextFlows Academy MCP Cohort** (https://nextflows.ai/).

---

# Scope

The current version focuses on practical city-based weather access through MCP.

The following are currently outside the core MCP scope:

* User registration and authentication
* Paid weather APIs
* Premium weather services
* Long-term historical climate analysis
* Interactive radar or satellite maps
* Cloud synchronization of favorite cities
* Permanent account-based user storage

---

# Demo Readiness Checklist

Before demonstrating the project, verify:

* [ ] `npm install` completes successfully.
* [ ] The MCP server starts successfully.
* [ ] MCP Inspector connects to the server.
* [ ] All eight tools appear in the Inspector.
* [ ] `search_city` resolves a valid city.
* [ ] `get_weather` returns current weather data.
* [ ] `create_weather_briefing` returns a practical briefing.
* [ ] `get_forecast` accepts between 1 and 7 days.
* [ ] `compare_weather` returns results for both cities.
* [ ] Favorite-city tools work correctly.
* [ ] Weather-alert handling works correctly.
* [ ] Invalid city input is rejected.
* [ ] Local fixture fallback works when live services are unavailable.
* [ ] Unexpected failures return safe responses.
* [ ] MCP responses do not expose stack traces or local filesystem paths.
* [ ] Week 5 manual tests are documented in `docs/test-plan.md`.

# Known Notes (Peer Review Follow-up)

During peer testing (fresh clone, README-only setup by a peer outside the
core team), two minor observations were noted. Neither is a code bug —
both are documented here for clarity.

### 1. `search_city` may return `"country": "unknown"` for some locations (live API only)

This comes directly from the Open-Meteo geocoding API response, not from
this project's code. Confirmed by direct testing: a query for `Amman` via
the live API returns a complete result including `"country": "Jordan"`,
while a query for `Ramallah` via the live API returns `"country": "unknown"`
even though the location itself resolves correctly. This is a data gap
specific to how Open-Meteo's live geocoding source labels certain
locations — not a general or consistent issue.

Notably, when the same `Ramallah` query falls back to the local fixture
(`data/cities.json`) — for example during a live API outage — it correctly
returns `"country": "Palestine"`, because the fixture data is maintained
directly by this project and does not depend on Open-Meteo's live response.

The application already handles the missing field safely either way —
`country` is typed as optional in `openMeteoGeocodingResponseSchema`, and
the code falls back to `"unknown"` rather than crashing or returning
malformed data. No fix needed on our side; this is an upstream data
characteristic of the live API, not an application bug.

### 2. README states Node.js 20+, but the project also ran on Node 18

The peer tester ran the project successfully on Node 18, with some
install-time warnings (no functional errors). The README's Node 20+
requirement reflects the version specified in `package.json`
(`"engines": { "node": ">=20" }`), which is the officially supported and
tested version. Node 18 may work in practice, but is not guaranteed or
officially supported — Node 20+ remains the recommended version for this
project.


---

# License

This project is licensed under the **MIT License**.
