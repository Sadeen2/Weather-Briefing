# Design: Weather Briefing MCP

## Pitch
A lot of users require checking weather conditions several times during the day without having to use additional applications or even web tabs. With this server for MCPs, weather applications could be used by the AI directly in order to provide answers to questions regarding weather conditions or predictions. The target audience is regular people, such as students or employees, who want to know about the weather forecast in any given city quickly and reliably.


## User & Demo Story

During Demo Day, the user asks the assistant: “What is the weather in Hebron, and should I carry an umbrella tomorrow?” The assistant calls `get_weather` using the city name “Hebron” to retrieve the current conditions and calls `get_forecast` using the city name “Hebron” to retrieve tomorrow’s forecast. Both tools resolve the city name to geographic coordinates internally before requesting data from Open-Meteo.


## Tool Inventory

| tool_name | description | inputs | output (shape) | priority |
|---|---|---|---|---|
| search_city | Resolves a city name to geographic coordinates | city: string | { name, country, latitude, longitude } | P0 |
| get_weather | Returns current weather conditions for a city. | city: string | { temperature, conditions, humidity, windSpeed }<br>or { location: { name, country, latitude, longitude }, temperature, conditions, humidity, windSpeed } | P0 |
| create_weather_briefing | Creates a short, practical weather briefing with recommendations based on current and forecast data | location: string, days?: number (default 1), units?: "celsius" \| "fahrenheit" (default celsius) | { briefing: string, highlights: string[] } | P0 |
| get_forecast | Returns a multi-day weather forecast for a city. | city: string, days: number | { forecast: [{ date, minTemp, maxTemp, conditions }] }<br>or { location: { name, country, latitude, longitude }, forecast: [{ date, minTemp, maxTemp, conditions }] } | P1 |
| save_favorite_city | Saves a city as a favorite for quick access later | city: string | { success: boolean, savedCity: string } | P1 |
| list_favorite_cities | Returns the list of previously saved favorite cities | (none) | { favorites: string[] } | P1 |
| compare_weather | Compares current weather between two cities | city1: string, city2: string | { city1: {...}, city2: {...} } | P1 |
| get_weather_alerts | Returns active weather warnings or alerts for a specified location when alert information is available | location: string | { alerts: [{ type, severity, description }] } | P1 |

## Out of Scope
The first version of the Weather Briefing MCP Server will not include:
- User authentication, registration, or account management.
- Paid weather APIs or premium weather services.
- A mobile application or complete web user interface.
- Long-term historical weather or climate analysis.
- Interactive weather maps, radar images, or satellite images.
- Permanent cloud-based storage of user data — favorites are stored locally only, with no external database or account syncing.

## Success Criteria
- [ ] search_city correctly resolves a real city name (e.g. "Hebron") to valid geographic coordinates
- [ ] get_weather accepts a city name, resolves it internally, and returns live current weather data from the Open-Meteo API.
- [ ] get_forecast accepts a city name and number of days, resolves the city internally, and returns forecast data from the Open-Meteo API.
- [ ] create_weather_briefing combines current and forecast data into a short, readable summary with at least one practical recommendation (e.g. "bring an umbrella")

## Risks

### Risk 1: Weather Data Source Failure
The external weather API may be unavailable or slow during Demo Day.

*Mitigation:* Add request timeouts, show a clear error on failure, and keep local JSON fixture data as an offline fallback.

### Risk 2: Ambiguous or Invalid Locations
A location name may be misspelled, unsupported, or shared by multiple cities.

*Mitigation:* Validate non-empty input, always return the resolved city/country, and return a clear LOCATION_NOT_FOUND error when no match is found. `get_weather` and `get_forecast` resolve their city inputs internally and return a clear `LOCATION_NOT_FOUND` error when no matching city is available.

## Notes from reading Filesystem MCP Server

Studied the official `Filesystem` reference server (`modelcontextprotocol/servers`, `src/filesystem/README.md`) to compare naming and description conventions with our own tools.

- **Naming pattern:** tool names use snake_case, verb-first, action-object order (`read_text_file`, `write_file`, `move_file`, `list_allowed_directories`) — consistent with our own `search_city`, `get_weather`, `create_weather_briefing` naming.
- **Description length:** each tool gets one short, imperative sentence (e.g. "Move or rename files and directories"), followed by a bulleted list of inputs and behavior notes below it — not one long paragraph.
- **Input docs:** every input is listed individually with its type in parentheses (e.g. `path (string)`, `head (number, optional)`), and optional fields are explicitly labeled "optional" rather than implied.
- **Errors phrased as constraints, not messages:** edge cases are stated directly under the relevant tool as plain constraints (e.g. "Cannot specify both `head` and `tail` simultaneously", "Fails if destination exists") instead of listing literal error strings — this tells the model exactly when a call will be rejected without over-specifying wording.
- **Safety hints via annotations:** each tool also declares `readOnlyHint` / `destructiveHint` / `idempotentHint` in a summary table, so a client can distinguish safe read-only calls from destructive ones (e.g. `write_file`, `edit_file`) at a glance. We don't have destructive tools yet, but this is worth adopting later if we add a `save_favorite_city`-style write with overwrite behavior.

No changes made to our PO descriptions this round — our current wording (short sentence + `.describe()` per field) already matches this pattern.
