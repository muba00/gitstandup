#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { collectCommits, type RepoResult } from "./git.js";
import { loadConfig, saveConfig, ensureConfigDir } from "./config.js";

const server = new McpServer({
  name: "gitstandup-mcp",
  version: "1.0.0",
});

// Tool: generate_standup
server.registerTool(
  "generate_standup",
  {
    title: "Generate Standup Notes",
    description:
      "Generate standup notes from git commits in configured repositories",
    inputSchema: {
      hours: z.number().optional().describe("Hours to look back (default: 24)"),
      repos: z
        .array(z.string())
        .optional()
        .describe("Specific repo paths to use instead of configured ones"),
    },
    outputSchema: {
      repos: z.array(
        z.object({
          name: z.string(),
          path: z.string(),
          commits: z.array(
            z.object({
              hash: z.string(),
              message: z.string(),
              author: z.string(),
              timestamp: z.string(),
              files: z.array(z.string()),
              diff: z.string(),
              stats: z.object({
                additions: z.number(),
                deletions: z.number(),
              }),
            })
          ),
          error: z.string().optional(),
        })
      ),
      summary: z.object({
        totalCommits: z.number(),
        totalRepos: z.number(),
        timeRange: z.string(),
        user: z.string().optional(),
      }),
    },
  },
  async ({ hours = 24, repos }: { hours?: number; repos?: string[] }) => {
    const config = await loadConfig();
    const repoPaths = repos || config.repos;

    if (repoPaths.length === 0) {
      const output = {
        repos: [],
        summary: {
          totalCommits: 0,
          totalRepos: 0,
          timeRange: `last ${hours} hours`,
        },
      };
      return {
        content: [
          {
            type: "text",
            text: "No repositories configured. Use add_repos tool to add repositories.",
          },
        ],
        structuredContent: output,
      };
    }

    const results = await collectCommits(repoPaths, hours);
    const totalCommits = results.reduce(
      (sum: number, r: RepoResult) => sum + (r.commits?.length || 0),
      0
    );

    const output = {
      repos: results,
      summary: {
        totalCommits,
        totalRepos: results.length,
        timeRange: `last ${hours} hours`,
        user: results[0]?.commits?.[0]?.author,
      },
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(output, null, 2),
        },
      ],
      structuredContent: output,
    };
  }
);

// Tool: add_repos
server.registerTool(
  "add_repos",
  {
    title: "Add Repositories",
    description: "Add repository paths to the configuration",
    inputSchema: {
      paths: z.array(z.string()).describe("Absolute paths to git repositories"),
    },
    outputSchema: {
      added: z.array(z.string()),
      repos: z.array(z.string()),
    },
  },
  async ({ paths }: { paths: string[] }) => {
    await ensureConfigDir();
    const config = await loadConfig();

    const newPaths = paths.filter((p: string) => !config.repos.includes(p));
    config.repos.push(...newPaths);

    await saveConfig(config);

    const output = {
      added: newPaths,
      repos: config.repos,
    };

    return {
      content: [
        {
          type: "text",
          text: `Added ${newPaths.length} repository(ies). Total: ${config.repos.length}`,
        },
      ],
      structuredContent: output,
    };
  }
);

// Tool: list_repos
server.registerTool(
  "list_repos",
  {
    title: "List Repositories",
    description: "List currently configured repositories",
    inputSchema: {},
    outputSchema: {
      repos: z.array(z.string()),
      count: z.number(),
    },
  },
  async () => {
    const config = await loadConfig();

    const output = {
      repos: config.repos,
      count: config.repos.length,
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(output, null, 2),
        },
      ],
      structuredContent: output,
    };
  }
);

// Tool: remove_repos
server.registerTool(
  "remove_repos",
  {
    title: "Remove Repositories",
    description: "Remove repository paths from the configuration",
    inputSchema: {
      paths: z.array(z.string()).describe("Repository paths to remove"),
    },
    outputSchema: {
      removed: z.array(z.string()),
      repos: z.array(z.string()),
    },
  },
  async ({ paths }: { paths: string[] }) => {
    const config = await loadConfig();

    const removed = paths.filter((p: string) => config.repos.includes(p));
    config.repos = config.repos.filter((p: string) => !paths.includes(p));

    await saveConfig(config);

    const output = {
      removed,
      repos: config.repos,
    };

    return {
      content: [
        {
          type: "text",
          text: `Removed ${removed.length} repository(ies). Remaining: ${config.repos.length}`,
        },
      ],
      structuredContent: output,
    };
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("GitStandup MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
