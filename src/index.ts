import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";

import { registerGetWeatherTool } from "./tools/get-weather.js";
import { registerGetForecastTool } from "./tools/get-forecast.js";
import { registerCompareWeatherTool } from "./tools/compare-weather.js";
import { registerSearchCityTool } from "./tools/search-city.js";
import { registerCreateWeatherBriefingTool } from "./tools/create-weather-briefing.js";

function createServer(): McpServer {
  const server = new McpServer({
    name: "weather-briefing",
    version: "0.2.0",
  });

  registerGetWeatherTool(server);
  registerGetForecastTool(server);
  registerCompareWeatherTool(server);
  registerSearchCityTool(server);
  registerCreateWeatherBriefingTool(server);

  return server;
}

void serveStdio(createServer);

console.error("Weather Briefing MCP server running on stdio");