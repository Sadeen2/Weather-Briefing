import { McpServer } from "@modelcontextprotocol/server";
import {
  getWeatherAlertsInputSchema,
  openMeteoForecastResponseSchema,
} from "../schemas/get-weather-alerts.js";
import { fetchJson } from "../lib/http.js";
import fixtureAlerts from "../../data/weather-alerts.json" with { type: "json" };
import fixtureCities from "../../data/cities.json" with { type: "json" };

// WMO weather codes that indicate a notable weather event worth alerting on
const ALERT_CODE_MAP: Record<number, { type: string; severity: string }> = {
  65: { type: "Heavy Rain", severity: "moderate" },
  82: { type: "Violent Rain Showers", severity: "high" },
  95: { type: "Thunderstorm", severity: "moderate" },
  96: { type: "Thunderstorm with Hail", severity: "high" },
  99: { type: "Severe Thunderstorm with Hail", severity: "high" },
};

export function registerGetWeatherAlertsTool(server: McpServer): void {
  server.registerTool(
    "get_weather_alerts",
    {
      title: "Get Weather Alerts",
      description:
        "Returns active weather warnings or alerts for a specified location when alert information is available",
      inputSchema: getWeatherAlertsInputSchema.shape,
    },
    async ({ location }) => {
      const today = new Date().toISOString().split("T")[0];

      try {
        // 1. Find the city coordinates via our local city list (fast, no network)
        const city = fixtureCities.cities.find(
          (c) => c.name.toLowerCase() === location.toLowerCase(),
        );

        if (!city) {
          throw new Error(`City "${location}" not found in known city list`);
        }

        // 2. Ask Open-Meteo for today's forecast weather code + wind
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&daily=weather_code,wind_speed_10m_max&timezone=auto&forecast_days=1`;
        const rawData = await fetchJson(url);
        const data = openMeteoForecastResponseSchema.parse(rawData);

        const code = data.daily?.weather_code?.[0];
        const alertInfo = code !== undefined ? ALERT_CODE_MAP[code] : undefined;

        const alerts = alertInfo
          ? [
              {
                city: city.name,
                date: today,
                type: alertInfo.type,
                severity: alertInfo.severity,
                description: `${alertInfo.type} expected. Weather code ${code}.`,
              },
            ]
          : [];

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ alerts, source: "live" }, null, 2),
            },
          ],
        };
      } catch (error) {
        console.error(
          `[get_weather_alerts] failed for "${location}":`,
          error instanceof Error ? error.message : error,
        );

        // 3. Fallback: use local fixture if the API/network fails
        const fallbackAlerts = fixtureAlerts.alerts
          .filter((a) => a.city.toLowerCase() === location.toLowerCase())
          .map((a) => ({ ...a, date: today }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                { alerts: fallbackAlerts, source: "fixture", note: "Live API unavailable, used local fixture." },
                null,
                2,
              ),
            },
          ],
        };
      }
    },
  );
}