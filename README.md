# mcp-arivo

A Model Context Protocol (MCP) server for Arivo CRM integration, enabling AI assistants to interact with your Arivo CRM data through a standardized interface.

## Features

- **Full CRUD Operations**: Create, read, update, and delete contacts, deals, tasks, and notes
- **Secure**: API key stored locally, never transmitted or embedded
- **Easy Setup**: Simple configuration via environment variables or config file
- **MCP Compatible**: Works with Claude Desktop, ChatGPT, and other MCP-compatible clients
- **TypeScript**: Fully typed for better development experience

## Installation

### Global Installation (Recommended)

```bash
npm install -g mcp-arivo
```

### Local Installation

```bash
npm install mcp-arivo
```

## Configuration

### Option 1: Environment Variables (Recommended)

```bash
export ARIVO_API_KEY="your-arivo-api-key"
export ARIVO_API_URL="https://arivo.com.br/api/v2"  # Optional, defaults to this URL
```

### Option 2: Configuration File

Create a `config.json` file in your project directory:

```json
{
  "apiKey": "your-arivo-api-key",
  "apiUrl": "https://arivo.com.br/api/v2"
}
```

### Option 3: Command Line Arguments

```bash
mcp-arivo --api-key your-api-key --api-url https://arivo.com.br/api/v2
```

## Usage

### Running the Server

```bash
# If installed globally
mcp-arivo

# If installed locally
npx mcp-arivo

# With command line options
mcp-arivo --api-key your-api-key
```

### Connecting to Claude Desktop

Add the following to your Claude Desktop configuration file:

**Windows**: `%APPDATA%\\Claude\\claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "arivo-crm": {
      "command": "mcp-arivo",
      "env": {
        "ARIVO_API_KEY": "your-arivo-api-key"
      }
    }
  }
}
```

## Available Tools

### Contacts

- `list_contacts` - List all contacts with optional filtering
- `get_contact` - Get a specific contact by ID
- `create_contact` - Create a new contact
- `update_contact` - Update an existing contact
- `delete_contact` - Delete a contact

### Deals

- `list_deals` - List all deals with optional filtering
- `get_deal` - Get a specific deal by ID
- `create_deal` - Create a new deal
- `update_deal` - Update an existing deal
- `delete_deal` - Delete a deal

### Tasks

- `list_tasks` - List all tasks with optional filtering
- `get_task` - Get a specific task by ID
- `create_task` - Create a new task
- `update_task` - Update an existing task
- `delete_task` - Delete a task

### Notes

- `list_notes` - List all notes with optional filtering
- `get_note` - Get a specific note by ID
- `create_note` - Create a new note
- `update_note` - Update an existing note
- `delete_note` - Delete a note

## Example Usage with Claude

Once connected, you can ask Claude to interact with your Arivo CRM:

```
"List all my contacts"
"Create a new contact named John Doe with email john@example.com"
"Show me all deals in the pipeline"
"Create a task to follow up with contact ID 123"
"Add a note to deal ID 456 saying 'Customer requested custom pricing'"
```

## API Coverage

This MCP server covers the core Arivo CRM REST API endpoints:

| Resource | GET (List) | GET (Single) | POST (Create) | PUT (Update) | DELETE |
|----------|------------|--------------|---------------|--------------|--------|
| Contacts | ✅ | ✅ | ✅ | ✅ | ✅ |
| Deals    | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tasks    | ✅ | ✅ | ✅ | ✅ | ✅ |
| Notes    | ✅ | ✅ | ✅ | ✅ | ✅ |

## Development

### Building from Source

```bash
git clone https://github.com/your-username/mcp-arivo.git
cd mcp-arivo
npm install
npm run build
```

### Running in Development Mode

```bash
npm run dev
```

### Testing

```bash
npm test
```

## Error Handling

The server provides detailed error messages for common scenarios:

- **401 Unauthorized**: Invalid or missing API key
- **404 Not Found**: Resource not found
- **Network Errors**: Connection issues with Arivo API
- **Validation Errors**: Missing required fields or invalid data

## Security

- API keys are stored locally and never transmitted except to the Arivo API
- All requests use HTTPS
- No sensitive data is logged or cached

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- [Arivo CRM API Documentation](https://arivo.docs.apiary.io)
- [MCP Specification](https://modelcontextprotocol.io)
- [Issue Tracker](https://github.com/your-username/mcp-arivo/issues)

## Changelog

### 1.0.0
- Initial release
- Full CRUD operations for contacts, deals, tasks, and notes
- MCP protocol implementation
- CLI support with configuration options