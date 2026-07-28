import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { registerGetWeatherTool } from "./tools/get-weather.js";
import { registerSearchCityTool } from "./tools/searchCity.js";

function createServer(): McpServer {
  const server = new McpServer({
    name: "mcprepo",
    version: "0.1.0",
  });

  registerGetWeatherTool(server);
  registerSearchCityTool(server);

  return server;
}

void serveStdio(createServer);
console.error("mcprepo MCP server running on stdio");