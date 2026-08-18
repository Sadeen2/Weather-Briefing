import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { McpServer } from "@modelcontextprotocol/server";

type MarkdownResource = {
  name: string;
  uri: string;
  filePath: string;
  description: string;
};

const moduleDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(moduleDirectory, "..", "..");

const markdownResources: MarkdownResource[] = [
  {
    name: "design",
    uri: "weather://docs/design",
    filePath: resolve(repositoryRoot, "docs", "design.md"),
    description: "Project design notes for the Weather Briefing server.",
  },
  {
    name: "data-plan",
    uri: "weather://docs/data-plan",
    filePath: resolve(repositoryRoot, "docs", "data-plan.md"),
    description: "Data source and fallback plan for Weather Briefing tools.",
  },
  {
    name: "readme",
    uri: "weather://docs/readme",
    filePath: resolve(repositoryRoot, "README.md"),
    description: "Repository overview and setup instructions.",
  },
];

async function readMarkdownResource(resource: MarkdownResource): Promise<string> {
  try {
    return await readFile(resource.filePath, "utf8");
  } catch (error) {
    console.error(
      `[resources] Failed to read ${resource.uri} from ${resource.filePath}:`,
      error,
    );
    throw new Error(`Unable to read ${resource.name} resource.`);
  }
}

function registerMarkdownResource(
  server: McpServer,
  resource: MarkdownResource,
): void {
  server.registerResource(
    resource.name,
    resource.uri,
    {
      description: resource.description,
      mimeType: "text/markdown",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/markdown",
          text: await readMarkdownResource(resource),
        },
      ],
    }),
  );
}

export function registerResources(server: McpServer): void {
  for (const resource of markdownResources) {
    registerMarkdownResource(server, resource);
  }
}
