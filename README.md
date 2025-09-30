# mcp-arivo

A Model Context Protocol (MCP) server for Arivo CRM integration, enabling AI assistants to interact with your Arivo CRM data through a standardized interface.

## Example Usage

Once connected, you can your AI assistant/agent to interact with your Arivo CRM:

```
"List me 100 contacts that were recently updated"
"Create a new contact named John Doe with email john@example.com and phone (555) 123-4567"
"Add tags 'vip' and 'gold' to contact John Doe"
"How many deals are open in the last step of pipeline 'Funil de vendas'?"
"Create a task to follow up with company Acme next week"
"Add a note to deal ID 71 saying 'Customer requested custom pricing'"
"List all products in the 'electronics' category"
"Create a custom record for Pizza with pepperoni topping"
"Show me all users in the sales team"
"What are the available task types?"
```

## Requirements

- Node.js 18.0.0 or higher
- Arivo CRM API key (obtain from your Arivo CRM account settings)
- Compatible with MCP clients:
  - Claude Desktop
  - Claude Code
  - Cursor
  - VSCode with MCP extension
  - Windsurf
  - Other MCP-compatible clients

## Installation

<details>
<summary><b>Claude Desktop</b></summary>

1. Open your Claude Desktop configuration file:
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **macOS/Linux**: `~/Library/Application Support/Claude/claude_desktop_config.json`

2. Add the MCP server configuration:
```json
{
  "mcpServers": {
    "arivo-crm": {
      "command": "npx",
      "args": ["-y", "mcp-arivo"],
      "env": {
        "ARIVO_API_KEY": "your-arivo-api-key"
      }
    }
  }
}
```

3. Restart Claude Desktop

</details>

<details>
<summary><b>Claude Code</b></summary>

1. Open your Claude Code MCP settings file:
   - **Windows**: `%APPDATA%\Claude\claude_code_mcp_settings.json`
   - **macOS/Linux**: `~/Library/Application Support/Claude/claude_code_mcp_settings.json`

2. Add the MCP server configuration:
```json
{
  "mcpServers": {
    "arivo-crm": {
      "command": "npx",
      "args": ["-y", "mcp-arivo"],
      "env": {
        "ARIVO_API_KEY": "your-arivo-api-key"
      }
    }
  }
}
```

3. Restart Claude Code or reload the MCP settings

</details>

<details>
<summary><b>Cursor</b></summary>

1. Open Cursor Settings (Ctrl+Shift+J or Cmd+Shift+J)

2. Navigate to "Features" → "Model Context Protocol"

3. Click "Add MCP Server" and configure:
   - **Name**: `arivo-crm`
   - **Command**: `npx`
   - **Arguments**: `-y mcp-arivo`
   - **Environment Variables**:
     ```
     ARIVO_API_KEY=your-arivo-api-key
     ```

4. Restart Cursor

</details>

<details>
<summary><b>VS Code</b></summary>

1. Install the [MCP extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ModelContextProtocol.mcp)

2. Open VS Code settings (Ctrl+, or Cmd+,) and search for "MCP"

3. Edit the MCP configuration file or add via UI:
```json
{
  "mcp.servers": {
    "arivo-crm": {
      "command": "npx",
      "args": ["-y", "mcp-arivo"],
      "env": {
        "ARIVO_API_KEY": "your-arivo-api-key"
      }
    }
  }
}
```

4. Reload VS Code window

</details>

<details>
<summary><b>Windsurf</b></summary>

1. Open Windsurf settings and navigate to MCP configuration

2. Add the server configuration:
```json
{
  "mcpServers": {
    "arivo-crm": {
      "command": "npx",
      "args": ["-y", "mcp-arivo"],
      "env": {
        "ARIVO_API_KEY": "your-arivo-api-key"
      }
    }
  }
}
```

3. Restart Windsurf

</details>

<details>
<summary><b>Gemini CLI</b></summary>

Configure MCP server for Gemini CLI:

```bash
# macOS/Linux
export MCP_SERVERS='{"arivo-crm":{"command":"npx","args":["-y","mcp-arivo"],"env":{"ARIVO_API_KEY":"your-arivo-api-key"}}}'

# Windows (PowerShell)
$env:MCP_SERVERS='{"arivo-crm":{"command":"npx","args":["-y","mcp-arivo"],"env":{"ARIVO_API_KEY":"your-arivo-api-key"}}}'
```

Then run Gemini CLI with MCP support enabled.

**Windows Note**: For persistent configuration, add the environment variable to your system environment variables through System Properties → Advanced → Environment Variables

</details>

<details>
<summary><b>GitHub Copilot Coding Agent</b></summary>

1. Create or edit the Copilot MCP configuration file:
   - **Windows**: `%USERPROFILE%\.github-copilot\mcp-servers.json`
   - **macOS/Linux**: `~/.github-copilot/mcp-servers.json`

2. Add the MCP server configuration:
```json
{
  "mcpServers": {
    "arivo-crm": {
      "command": "npx",
      "args": ["-y", "mcp-arivo"],
      "env": {
        "ARIVO_API_KEY": "your-arivo-api-key"
      }
    }
  }
}
```

3. Restart your IDE or coding environment

</details>

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


## Available Tools

### Contacts

- `list_contacts` - List all contacts with optional filtering (type, name, email, phone, tags, etc.)
- `get_contact` - Get a specific contact by ID
- `create_contact` - Create a new contact with phones, emails, and addresses
- `update_contact` - Update an existing contact
- `delete_contact` - Delete a contact

### Deals

- `list_deals` - List all deals with optional filtering (status, temperature, pipeline, tags, etc.)
- `get_deal` - Get a specific deal by ID
- `create_deal` - Create a new deal with quote items
- `update_deal` - Update an existing deal
- `delete_deal` - Delete a deal

### Tasks

- `list_tasks` - List all tasks with optional filtering (done status, contact, deal, etc.)
- `get_task` - Get a specific task by ID
- `create_task` - Create a new task with optional recurrence
- `update_task` - Update an existing task
- `delete_task` - Delete a task

### Notes

- `list_notes` - List all notes with optional filtering
- `get_note` - Get a specific note by ID
- `create_note` - Create a new note
- `update_note` - Update an existing note
- `delete_note` - Delete a note

### Products & Categories

- `list_products` - List all products with optional filtering
- `get_product` - Get a specific product by ID
- `create_product` - Create a new product
- `update_product` - Update an existing product
- `delete_product` - Delete a product
- `list_product_categories` - List all product categories
- `get_product_category` - Get a specific product category by ID
- `create_product_category` - Create a new product category
- `update_product_category` - Update an existing product category
- `delete_product_category` - Delete a product category

### Custom Records

- `list_custom_record_definitions` - List all custom record types
- `get_custom_record_definition` - Get a specific custom record type by ID
- `create_custom_record_definition` - Create a new custom record type
- `update_custom_record_definition` - Update an existing custom record type
- `delete_custom_record_definition` - Delete a custom record type
- `list_custom_records` - List custom records for a specific type
- `get_custom_record` - Get a specific custom record
- `create_custom_record` - Create a new custom record instance
- `update_custom_record` - Update an existing custom record
- `delete_custom_record` - Delete a custom record

### Reference Data (Read-Only)

- `list_users` - List all users with optional filtering
- `get_user` - Get a specific user by ID
- `list_teams` - List all teams
- `get_team` - Get a specific team by ID
- `list_pipelines` - List all sales pipelines with their steps
- `get_pipeline` - Get a specific pipeline by ID
- `list_task_types` - List all available task types
- `get_custom_fields` - Get custom field definitions for a record type

### Attachments

- `list_attachment_files` - List attachment files with optional filtering
- `get_attachment_file` - Get a specific attachment file by ID
- `delete_attachment_file` - Delete an attachment file

## API Coverage

This MCP server provides comprehensive coverage of the Arivo CRM REST API:

| Resource | GET (List) | GET (Single) | POST (Create) | PUT (Update) | DELETE |
|----------|------------|--------------|---------------|--------------|--------|
| Contacts | ✅ | ✅ | ✅ | ✅ | ✅ |
| Deals    | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tasks    | ✅ | ✅ | ✅ | ✅ | ✅ |
| Notes    | ✅ | ✅ | ✅ | ✅ | ✅ |
| Products | ✅ | ✅ | ✅ | ✅ | ✅ |
| Product Categories | ✅ | ✅ | ✅ | ✅ | ✅ |
| Custom Record Definitions | ✅ | ✅ | ✅ | ✅ | ✅ |
| Custom Records | ✅ | ✅ | ✅ | ✅ | ✅ |
| Users    | ✅ | ✅ | - | - | - |
| Teams    | ✅ | ✅ | - | - | - |
| Pipelines | ✅ | ✅ | - | - | - |
| Task Types | ✅ | - | - | - | - |
| Custom Fields | ✅ | - | - | - | - |
| Attachment Files | ✅ | ✅ | - | - | ✅ |

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
- [Issue Tracker](https://github.com/arivo-crm/mcp-arivo/issues)
