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
import { TaskTypesHandler, taskTypesToolDefinitions } from './handlers/task-types.js';
import { UsersHandler, usersToolDefinitions } from './handlers/users.js';
import { TeamsHandler, teamsToolDefinitions } from './handlers/teams.js';
import { PipelinesHandler, pipelinesToolDefinitions } from './handlers/pipelines.js';
import { CustomFieldsHandler, customFieldsToolDefinitions } from './handlers/custom-fields.js';
import { AttachmentFilesHandler, attachmentFilesToolDefinitions } from './handlers/attachment-files.js';
import { ProductCategoriesHandler, productCategoriesToolDefinitions } from './handlers/product-categories.js';
import { ProductsHandler, productsToolDefinitions } from './handlers/products.js';
import { CustomRecordDefinitionsHandler, customRecordDefinitionsToolDefinitions } from './handlers/custom-record-definitions.js';
import { CustomRecordsHandler, customRecordsToolDefinitions } from './handlers/custom-records.js';
import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));
const VERSION = packageJson.version;

const program = new Command();

program
  .name('mcp-arivo')
  .description('MCP server for Arivo CRM integration')
  .version(VERSION)
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
  private taskTypesHandler: TaskTypesHandler;
  private usersHandler: UsersHandler;
  private teamsHandler: TeamsHandler;
  private pipelinesHandler: PipelinesHandler;
  private customFieldsHandler: CustomFieldsHandler;
  private attachmentFilesHandler: AttachmentFilesHandler;
  private productCategoriesHandler: ProductCategoriesHandler;
  private productsHandler: ProductsHandler;
  private customRecordDefinitionsHandler: CustomRecordDefinitionsHandler;
  private customRecordsHandler: CustomRecordsHandler;

  constructor() {
    this.server = new Server(
      {
        name: 'arivo-crm-server',
        version: VERSION,
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
      this.taskTypesHandler = new TaskTypesHandler(this.apiClient);
      this.usersHandler = new UsersHandler(this.apiClient);
      this.teamsHandler = new TeamsHandler(this.apiClient);
      this.pipelinesHandler = new PipelinesHandler(this.apiClient);
      this.customFieldsHandler = new CustomFieldsHandler(this.apiClient);
      this.attachmentFilesHandler = new AttachmentFilesHandler(this.apiClient);
      this.productCategoriesHandler = new ProductCategoriesHandler(this.apiClient);
      this.productsHandler = new ProductsHandler(this.apiClient);
      this.customRecordDefinitionsHandler = new CustomRecordDefinitionsHandler(this.apiClient);
      this.customRecordsHandler = new CustomRecordsHandler(this.apiClient);
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
          ...taskTypesToolDefinitions,
          ...usersToolDefinitions,
          ...teamsToolDefinitions,
          ...pipelinesToolDefinitions,
          ...customFieldsToolDefinitions,
          ...attachmentFilesToolDefinitions,
          ...productCategoriesToolDefinitions,
          ...productsToolDefinitions,
          ...customRecordDefinitionsToolDefinitions,
          ...customRecordsToolDefinitions,
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

          // Task Types handlers
          case 'list_task_types':
            result = await this.taskTypesHandler.listTaskTypes();
            break;

          // Users handlers
          case 'list_users':
            result = await this.usersHandler.listUsers(args);
            break;
          case 'get_user':
            result = await this.usersHandler.getUser(args as { id: number });
            break;

          // Teams handlers
          case 'list_teams':
            result = await this.teamsHandler.listTeams(args);
            break;
          case 'get_team':
            result = await this.teamsHandler.getTeam(args as { id: number });
            break;

          // Pipelines handlers
          case 'list_pipelines':
            result = await this.pipelinesHandler.listPipelines(args);
            break;
          case 'get_pipeline':
            result = await this.pipelinesHandler.getPipeline(args as { id: number });
            break;

          // Custom Fields handlers
          case 'get_custom_fields':
            result = await this.customFieldsHandler.getCustomFields(args as { id: string });
            break;

          // Attachment Files handlers
          case 'list_attachment_files':
            result = await this.attachmentFilesHandler.listAttachmentFiles(args);
            break;
          case 'get_attachment_file':
            result = await this.attachmentFilesHandler.getAttachmentFile((args as { id: number }).id);
            break;
          case 'delete_attachment_file':
            result = await this.attachmentFilesHandler.deleteAttachmentFile((args as { id: number }).id);
            break;

          // Product Categories handlers
          case 'list_product_categories':
            result = await this.productCategoriesHandler.listProductCategories(args);
            break;
          case 'get_product_category':
            result = await this.productCategoriesHandler.getProductCategory((args as { id: number }).id);
            break;
          case 'create_product_category':
            result = await this.productCategoriesHandler.createProductCategory(args as any);
            break;
          case 'update_product_category':
            result = await this.productCategoriesHandler.updateProductCategory(args as any);
            break;
          case 'delete_product_category':
            result = await this.productCategoriesHandler.deleteProductCategory((args as { id: number }).id);
            break;

          // Products handlers
          case 'list_products':
            result = await this.productsHandler.listProducts(args);
            break;
          case 'get_product':
            result = await this.productsHandler.getProduct((args as { id: number }).id);
            break;
          case 'create_product':
            result = await this.productsHandler.createProduct(args as any);
            break;
          case 'update_product':
            result = await this.productsHandler.updateProduct(args as any);
            break;
          case 'delete_product':
            result = await this.productsHandler.deleteProduct((args as { id: number }).id);
            break;

          // Custom Record Definitions handlers
          case 'list_custom_record_definitions':
            result = await this.customRecordDefinitionsHandler.listCustomRecordDefinitions(args as any);
            break;
          case 'get_custom_record_definition':
            result = await this.customRecordDefinitionsHandler.getCustomRecordDefinition((args as { id: number }).id);
            break;
          case 'create_custom_record_definition':
            result = await this.customRecordDefinitionsHandler.createCustomRecordDefinition(args as any);
            break;
          case 'update_custom_record_definition':
            result = await this.customRecordDefinitionsHandler.updateCustomRecordDefinition(args as any);
            break;
          case 'delete_custom_record_definition':
            result = await this.customRecordDefinitionsHandler.deleteCustomRecordDefinition((args as { id: number }).id);
            break;

          // Custom Records handlers
          case 'list_custom_records':
            result = await this.customRecordsHandler.listCustomRecords(args as any);
            break;
          case 'get_custom_record':
            result = await this.customRecordsHandler.getCustomRecord(args as any);
            break;
          case 'create_custom_record':
            result = await this.customRecordsHandler.createCustomRecord(args as any);
            break;
          case 'update_custom_record':
            result = await this.customRecordsHandler.updateCustomRecord(args as any);
            break;
          case 'delete_custom_record':
            result = await this.customRecordsHandler.deleteCustomRecord(args as any);
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