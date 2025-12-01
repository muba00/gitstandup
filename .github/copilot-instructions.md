# GitStandup MCP Server

MCP server for generating daily standup notes from git commits across multiple repositories.

## Project Status

- [x] Create project structure and copilot instructions
- [x] Get MCP project setup information
- [x] Scaffold MCP server project
- [x] Implement git operations module
- [x] Implement config management
- [x] Implement MCP tools
- [x] Test and verify the MCP server

## Project Details

- **Type**: MCP (Model Context Protocol) Server
- **Language**: TypeScript
- **Purpose**: Collect git commits from multiple repos and generate standup summaries via AI
- **Config Storage**: ~/.gitstandup/config.json

## Implementation Complete

The GitStandup MCP server is now fully implemented with the following features:

### Core Functionality

- **Git Operations** (`src/git.ts`): Collects commits from repositories, filters by current user, includes diffs with smart truncation
- **Config Management** (`src/config.ts`): Persists repository paths in `~/.gitstandup/config.json`
- **MCP Server** (`src/index.ts`): Exposes 4 tools via Model Context Protocol

### Available MCP Tools

1. **generate_standup**: Generates standup notes from configured repos

   - Optional `hours` parameter (default: 24)
   - Optional `repos` array to override configured repos
   - Returns structured data with commits, diffs, and summary

2. **add_repos**: Add repository paths to configuration

   - Accepts array of absolute paths
   - Persists to `~/.gitstandup/config.json`

3. **list_repos**: List currently configured repositories

   - No parameters
   - Returns array of configured repo paths

4. **remove_repos**: Remove repositories from configuration
   - Accepts array of paths to remove
   - Updates `~/.gitstandup/config.json`

### Smart Features

- Filters commits by current git user (per repo)
- Truncates large diffs (500 lines per file, 2000 per commit)
- Skips generated files (lock files, minified files)
- Graceful error handling for invalid repos
- Parallel processing of multiple repositories

### Usage

To use with MCP clients (VS Code, Claude Desktop, etc.):

```json
{
  "mcpServers": {
    "gitstandup": {
      "command": "node",
      "args": ["/absolute/path/to/gitay/build/index.js"]
    }
  }
}
```

Or for development/testing:

```bash
npm install
npm run build
node build/index.js
```
