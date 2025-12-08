# GitStandup MCP Server

> Generate daily standup notes from your git commits using AI

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that collects git commits from multiple repositories and helps AI assistants create natural standup summaries.

## Features

- Track commits across multiple repositories
- Filtered by your git user email
- Configurable time period (default: 24 hours)
- Includes code diffs with smart truncation
- Persistent configuration in `~/.gitstandup/config.json`
- Skips generated files (lock files, minified code)

## Installation

```bash
# Using npx (recommended)
npx -y gitstandup-mcp

# Or install globally
npm install -g gitstandup-mcp
```

## Setup

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

### VS Code (GitHub Copilot)

Add to your VS Code MCP settings:

```json
{
  "gitstandup": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "gitstandup-mcp"]
  }
}
```

## Usage

Ask your AI assistant in natural language:

- "Generate my standup notes"
- "What did I work on yesterday?"
- "Show my commits from the last 2 days"

**First time:** Ask to add your repository paths, then generate standup notes.

The AI will create summaries like:
> Yesterday I:
>
> - Implemented OAuth authentication flow in the api-server
> - Fixed critical bug in payment processing
> - Added integration tests for user registration

## Available Tools

The server exposes four MCP tools:

**`generate_standup`** - Generate standup notes from configured repositories
- `hours` (optional): Hours to look back (default: 24)
- `repos` (optional): Specific repo paths to use

**`add_repos`** - Add repository paths to configuration
- `paths`: Array of absolute paths to git repositories

**`list_repos`** - List currently configured repositories

**`remove_repos`** - Remove repository paths from configuration
- `paths`: Array of repository paths to remove

## Configuration

Repository paths are stored in `~/.gitstandup/config.json`:

```json
{
  "repos": ["/Users/you/projects/project1", "/Users/you/projects/project2"]
}
```

You can edit this file manually or use the MCP tools.

## Development

```bash
git clone https://github.com/muba00/gitstandup.git
cd gitstandup
npm install
npm run build
node build/index.js  # Test locally
```

## Contributing

Contributions welcome! Please see [CONTRIBUTING.md](.github/CONTRIBUTING.md) for guidelines.

## License

MIT - see [LICENSE](LICENSE) for details.

---

**Note:** This tool only reads git commit history and does not modify your repositories.
