# GitStandup MCP Server

MCP server for generating daily standup notes from git commits across multiple repositories.

## Features

- Collect commits from multiple local git repositories
- Filter commits by current git user
- Configurable time range (default: last 24 hours)
- Smart diff truncation to manage token usage
- Persistent repo configuration at `~/.gitstandup/config.json`

## Installation

```bash
npm install -g gitstandup-mcp
```

## Usage with Claude Desktop

Add to your Claude Desktop config at `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "gitstandup": {
      "command": "npx",
      "args": ["-y", "gitstandup-mcp"]
    }
  }
}
```

## Available Tools

### `generate_standup`

Generate standup notes from configured repositories.

**Arguments:**

- `hours` (optional): Number of hours to look back (default: 24)
- `repos` (optional): Array of repo paths to use instead of configured ones

### `add_repos`

Add repository paths to the configuration.

**Arguments:**

- `paths`: Array of absolute paths to git repositories

### `list_repos`

List currently configured repositories.

### `remove_repos`

Remove repository paths from the configuration.

**Arguments:**

- `paths`: Array of repo paths to remove

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev
```

## Configuration

Repository paths are stored in `~/.gitstandup/config.json`.
