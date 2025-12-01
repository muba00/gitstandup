# Contributing to GitStandup

Thank you for your interest in contributing to GitStandup! 🎉

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:

- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node version, MCP client)

### Suggesting Features

We welcome feature suggestions! Please create an issue describing:

- The problem you're trying to solve
- Your proposed solution
- Any alternative solutions you've considered

### Pull Requests

1. **Fork the repository**

   ```bash
   git clone https://github.com/muba00/gitstandup.git
   cd gitstandup
   ```

2. **Create a branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**

   - Write clean, readable code
   - Follow the existing code style
   - Add comments for complex logic

4. **Build and test**

   ```bash
   npm install
   npm run build
   ```

5. **Commit your changes**

   ```bash
   git commit -m "Add: your feature description"
   ```

6. **Push and create a PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Development Guidelines

### Code Style

- Use TypeScript
- Follow existing formatting conventions
- Use meaningful variable and function names
- Add type annotations where helpful

### Testing

- Test your changes with real git repositories
- Verify the MCP server works with Claude Desktop or VS Code
- Check error handling for edge cases

### Commit Messages

- Use clear, descriptive commit messages
- Start with a verb (Add, Fix, Update, etc.)
- Keep the first line under 72 characters

## Questions?

Feel free to open an issue for any questions about contributing!
