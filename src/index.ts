#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { loadConfig } from './config.js';
import { ArivoApiClient } from './utils/http.js';
import { ContactsHandler, contactsToolDefinitions } from './handlers/contacts.js';
import { DealsHandler, dealsToolDefinitions } from './handlers/deals.js';
import { TasksHandler, tasksToolDefinitions } from './handlers/tasks.js';
import { NotesHandler, notesToolDefinitions } from './handlers/notes.js';
import { Command } from 'commander';

const program = new Command();

program
  .name('mcp-arivo')
  .description('MCP server for Arivo CRM integration')
  .version('1.0.0')
  .option('--api-key <key>', 'Arivo API key (overrides ARIVO_API_KEY env var)')
  .option('--api-url <url>', 'Arivo API URL (overrides ARIVO_API_URL env var)')
  .parse();

const options = program.opts();

// Override environment variables with CLI options if provided
if (options.apiKey) {
  process.env.ARIVO_API_KEY = options.apiKey;
}
if (options.apiUrl) {
  process.env.ARIVO_API_URL = options.apiUrl;
}

class ArivoMCPServer {
  private server: Server;
  private apiClient: ArivoApiClient;
  private contactsHandler: ContactsHandler;
  private dealsHandler: DealsHandler;
  private tasksHandler: TasksHandler;
  private notesHandler: NotesHandler;

  constructor() {
    this.server = new Server(
      {
        name: 'arivo-crm-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    try {
      const config = loadConfig();
      this.apiClient = new ArivoApiClient(config);
      this.contactsHandler = new ContactsHandler(this.apiClient);
      this.dealsHandler = new DealsHandler(this.apiClient);
      this.tasksHandler = new TasksHandler(this.apiClient);
      this.notesHandler = new NotesHandler(this.apiClient);
    } catch (error: any) {
      console.error('Configuration error:', error.message);
      process.exit(1);
    }

    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          ...contactsToolDefinitions,
          ...dealsToolDefinitions,
          ...tasksToolDefinitions,
          ...notesToolDefinitions,
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        let result: any;

        // Contacts handlers
        switch (name) {
          case 'list_contacts':
            result = await this.contactsHandler.listContacts(args);
            break;
          case 'get_contact':
            result = await this.contactsHandler.getContact(args as { id: number });
            break;
          case 'create_contact':
            result = await this.contactsHandler.createContact(args as any);
            break;
          case 'update_contact':
            result = await this.contactsHandler.updateContact(args as any);
            break;
          case 'delete_contact':
            result = await this.contactsHandler.deleteContact(args as { id: number });
            break;

          // Deals handlers
          case 'list_deals':
            result = await this.dealsHandler.listDeals(args);
            break;
          case 'get_deal':
            result = await this.dealsHandler.getDeal(args as { id: number });
            break;
          case 'create_deal':
            result = await this.dealsHandler.createDeal(args as any);
            break;
          case 'update_deal':
            result = await this.dealsHandler.updateDeal(args as any);
            break;
          case 'delete_deal':
            result = await this.dealsHandler.deleteDeal(args as { id: number });
            break;

          // Tasks handlers
          case 'list_tasks':
            result = await this.tasksHandler.listTasks(args);
            break;
          case 'get_task':
            result = await this.tasksHandler.getTask(args as { id: number });
            break;
          case 'create_task':
            result = await this.tasksHandler.createTask(args as any);
            break;
          case 'update_task':
            result = await this.tasksHandler.updateTask(args as any);
            break;
          case 'delete_task':
            result = await this.tasksHandler.deleteTask(args as { id: number });
            break;

          // Notes handlers
          case 'list_notes':
            result = await this.notesHandler.listNotes(args);
            break;
          case 'get_note':
            result = await this.notesHandler.getNote(args as { id: number });
            break;
          case 'create_note':
            result = await this.notesHandler.createNote(args as any);
            break;
          case 'update_note':
            result = await this.notesHandler.updateNote(args as any);
            break;
          case 'delete_note':
            result = await this.notesHandler.deleteNote(args as { id: number });
            break;

          default:
            throw new Error(`Unknown tool: ${name}`);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Arivo MCP Server running on stdio');
  }
}

// Start the server
const server = new ArivoMCPServer();
server.run().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});