import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";

import { registerGetWeatherTool } from "./tools/get-weather.js";
import { registerSearchCityTool } from "./tools/searchCity.js";
import { registerCreateWeatherBriefingTool } from "./tools/create-weather-briefing.js";

function createServer(): McpServer {
  const server = new McpServer({
    name: "weather-briefing",
    version: "0.1.0",
  });

  registerGetWeatherTool(server);
  registerSearchCityTool(server);
  registerCreateWeatherBriefingTool(server);

  return server;
}

void serveStdio(createServer);

console.error("Weather Briefing MCP server running on stdio");