# GitStandup MCP Server

> Generate daily standup notes from your git commits using AI

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that automatically collects your git commits from multiple repositories and helps AI assistants generate natural, comprehensive standup summaries.

## ✨ Features

- 📦 **Multi-repo support** - Track commits across all your projects
- 👤 **User-specific** - Only shows your commits (filtered by git user.email)
- ⏰ **Time-based** - Configurable lookback period (default: last 24 hours)
- 🎯 **Smart diff analysis** - Includes code changes with intelligent truncation
- 💾 **Persistent config** - Remembers your repos in `~/.gitstandup/config.json`
- 🧹 **Clean output** - Skips generated files (lock files, minified code)

## 🚀 Quick Start

### Installation

```bash
# Using npx (no installation needed)
npx -y gitstandup-mcp

# Or install globally
npm install -g gitstandup-mcp
```

### Setup with Claude Desktop

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

### Setup with VS Code (GitHub Copilot)

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

## 📖 Usage

Once configured, you can use natural language with your AI assistant:

```
"Generate my standup notes"
"What did I work on yesterday?"
"Show my commits from the last 2 days"
```

### First Time Setup

1. **Add your repositories:**

   ```
   "Add /path/to/my/project to GitStandup"
   ```

2. **Generate standup notes:**

   ```
   "Generate my standup notes"
   ```

3. **The AI will create a summary like:**
   > Yesterday I:
   >
   > - Implemented OAuth authentication flow in the api-server
   > - Fixed critical bug in payment processing
   > - Added integration tests for user registration

## 🛠️ Available Tools

The server exposes four MCP tools that AI assistants can use:

### `generate_standup`

Generate standup notes from configured repositories.

**Parameters:**

- `hours` (optional): Number of hours to look back (default: 24)
- `repos` (optional): Array of specific repo paths to use

**Example:**

```typescript
{
  "hours": 48,  // Last 2 days
  "repos": ["/path/to/repo1", "/path/to/repo2"]  // Optional
}
```

### `add_repos`

Add repository paths to the configuration.

**Parameters:**

- `paths`: Array of absolute paths to git repositories

**Example:**

```typescript
{
  "paths": ["/Users/you/projects/my-app", "/Users/you/projects/api"]
}
```

### `list_repos`

List currently configured repositories.

**Returns:** Array of configured repository paths

### `remove_repos`

Remove repository paths from the configuration.

**Parameters:**

- `paths`: Array of repository paths to remove

## 🔧 Development

```bash
# Clone the repository
git clone https://github.com/muba00/gitstandup.git
cd gitstandup

# Install dependencies
npm install

# Build
npm run build

# Test locally
node build/index.js
```

### Project Structure

```
gitstandup/
├── src/
│   ├── index.ts      # MCP server setup and tool definitions
│   ├── git.ts        # Git operations and commit collection
│   └── config.ts     # Configuration management
├── build/            # Compiled JavaScript (generated)
└── package.json
```

## 📝 Configuration

Repository paths are stored in `~/.gitstandup/config.json`:

```json
{
  "repos": ["/Users/you/projects/project1", "/Users/you/projects/project2"]
}
```

You can edit this file manually or use the `add_repos` and `remove_repos` tools.

## 📦 Publishing to MCP Registry

This server is discoverable via the [GitHub MCP Registry](https://github.com/mcp) and [OSS MCP Community Registry](https://github.com/modelcontextprotocol/registry).

### For Maintainers

To publish a new version:

1. **Update version in both files:**

   ```bash
   # Update version in package.json and server.json
   npm version patch  # or minor/major
   ```

2. **Build and publish to npm:**

   ```bash
   npm run build
   npm publish
   ```

3. **Install mcp-publisher (first time only):**

   ```bash
   brew install mcp-publisher
   # OR
   curl -L "https://github.com/modelcontextprotocol/registry/releases/latest/download/mcp-publisher_$(uname -s | tr '[:upper:]' '[:lower:]')_$(uname -m | sed 's/x86_64/amd64/;s/aarch64/arm64/').tar.gz" | tar xz mcp-publisher && sudo mv mcp-publisher /usr/local/bin/
   ```

4. **Authenticate (first time only):**

   ```bash
   mcp-publisher login github
   ```

5. **Update server.json version to match package.json and publish:**
   ```bash
   mcp-publisher publish
   ```

The server will automatically appear in both the GitHub MCP Registry and the community registry, making it discoverable in VS Code, Claude Desktop, and other MCP-compatible clients.

## 🤝 Contributing

Contributions are welcome! Feel free to:

- 🐛 Report bugs
- 💡 Suggest new features
- 🔧 Submit pull requests

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

Built with:

- [Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [simple-git](https://github.com/steveukx/git-js)
- [Zod](https://github.com/colinhacks/zod)

---

**Note:** This tool only reads git commit history and does not modify your repositories.
