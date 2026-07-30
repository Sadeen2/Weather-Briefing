# Weather Briefing MCP

An MCP (Model Context Protocol) server that gives an AI assistant direct access to weather information — current conditions, short-term forecasts, and quick, practical weather briefings for any city — without needing a separate app or browser tab.

## Team

- Sadeen Ryahi
- Duaa Naji
- Rawand Bawatneh

## Academy

This project was developed as part of the [NextFlows Academy MCP Cohort] https://nextflows.ai/ .

## Setup

Install dependencies:

    npm install

## Week 1

Initial project scaffold with Node.js, TypeScript, and the MCP SDK set up, plus MCP Inspector verified locally.

## Week 2

### Design

Project pitch, user story, tool inventory, out-of-scope items, success criteria, and risks are documented in `docs/design.md`. The initial project choice is documented in `docs/project-choice.md`.

### Tools

Three P0 tools are registered with stub handlers (real data wiring comes in Week 3):

| Tool | Description |
|---|---|
| `search_city` | Resolves a city name to geographic coordinates |
| `get_weather` | Returns current weather conditions for a location |
| `create_weather_briefing` | Creates a short, practical weather briefing with recommendations |

Each tool has its own Zod input schema under `src/schemas/` and a matching `registerXxxTool` handler under `src/tools/`. All tools are registered together in `src/index.ts`.

### Run in development mode

    npm run dev

This starts the server over stdio using `tsx`. The server logs a startup banner to `stderr` and then stays alive, waiting on stdio — this is expected behavior, not a crash. Stop it with `Ctrl+C`.

### Test with MCP Inspector

    npx @modelcontextprotocol/inspector npx tsx src/index.ts

Open the printed URL in your browser, connect, and use the Tools tab to list and call any of the three registered tools.

## Week 2 — Multi-Tool Server Skeleton

- `get_weather` remains registered.
- `get_forecast` is registered with a P1 stub handler.
- `compare_weather` is registered with a P1 stub handler.
- Real forecast and comparison logic will be added during Week 3.
- Each tool has a matching valid JSON input example inside `examples/`.
- The development server can be started using `npm run dev`.

## Project Structure

    src/
├── index.ts                         # Server factory + stdio entry point
├── schemas/                         # Zod input schemas (one file per tool)
│   ├── search-city.ts
│   ├── get-weather.ts
│   ├── create-weather-briefing.ts
│   ├── get-forecast.ts
│   ├── compare-weather.ts
│   ├── save-favorite-city.ts
│   └── list-favorite-cities.ts
└── tools/                           # Tool handlers (one file per tool)
    ├── search-city.ts
    ├── get-weather.ts
    ├── create-weather-briefing.ts
    ├── get-forecast.ts
    ├── compare-weather.ts
    ├── save-favorite-city.ts
    └── list-favorite-cities.ts

examples/
├── search_city.json
├── get_weather.json
├── create_weather_briefing.json
├── get_forecast.json
├── compare_weather.json
├── save_favorite_city.json
└── list_favorite_cities.json

docs/
├── project-choice.md
└── design.md
