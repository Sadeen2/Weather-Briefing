# Design: Weather Briefing MCP

## Pitch
A lot of users require checking weather conditions several times during the day without having to use additional applications or even web tabs. With this server for MCPs, weather applications could be used by the AI directly in order to provide answers to questions regarding weather conditions or predictions. The target audience is regular people, such as students or employees, who want to know about the weather forecast in any given city quickly and reliably.


## User & Demo Story
During Demo Day, the user asks the assistant: “What is the weather in Hebron, and should I carry an umbrella tomorrow?” First, the assistant executes the search_city function to figure out where Hebron is, by determining its geographical coordinates. Next, the assistant uses get_weather to obtain current weather data and get_forecast to see what tomorrow’s forecast is.

## Tool Inventory

| tool_name | description | inputs | output (shape) | priority |
|---|---|---|---|---|
| search_city | Resolves a city name to geographic coordinates | city: string | { name, country, latitude, longitude } | P0 |
| get_weather | Returns current weather conditions for a location | latitude: number, longitude: number | { temperature, conditions, humidity, windSpeed } | P0 |
| create_weather_briefing | Creates a short, practical weather briefing with recommendations based on current and forecast data | location: string, days?: number (default 1), units?: "celsius" \| "fahrenheit" (default celsius) | { briefing: string, highlights: string[] } | P0 |
| get_forecast | Returns a multi-day weather forecast for a location | latitude: number, longitude: number, days: number | { forecast: [{ date, minTemp, maxTemp, conditions }] } | P1 |
| save_favorite_city | Saves a city as a favorite for quick access later | city: string | { success: boolean, savedCity: string } | P1 |
| list_favorite_cities | Returns the list of previously saved favorite cities | (none) | { favorites: string[] } | P1 |
| compare_weather | Compares current weather between two cities | city1: string, city2: string | { city1: {...}, city2: {...} } | P1 |
| get_weather_alerts | Returns active weather warnings or alerts for a specified location when alert information is available | location: string | { alerts: [{ type, severity, description }] } | P1 |

## 7. Out of Scope
The first version of the Weather Briefing MCP Server will not include:
- User authentication, registration, or account management.
- Paid weather APIs or premium weather services.
- A mobile application or complete web user interface.
- Long-term historical weather or climate analysis.
- Interactive weather maps, radar images, or satellite images.
- Permanent cloud-based storage of user data — favorites are stored locally only, with no external database or account syncing.

## Success Criteria
- [ ] search_city correctly resolves a real city name (e.g. "Hebron") to valid geographic coordinates
- [ ] get_weather returns live current conditions (temperature, humidity, wind speed) for those coordinates from the Open-Meteo API
- [ ] create_weather_briefing combines current and forecast data into a short, readable summary with at least one practical recommendation (e.g. "bring an umbrella")

## Risks

### Risk 1: Weather Data Source Failure
The external weather API may be unavailable or slow during Demo Day.

*Mitigation:* Add request timeouts, show a clear error on failure, and keep local JSON fixture data as an offline fallback.

### Risk 2: Ambiguous or Invalid Locations
A location name may be misspelled, unsupported, or shared by multiple cities.

*Mitigation:* Validate non-empty input, always return the resolved city/country, and return a clear LOCATION_NOT_FOUND error when no match is found.