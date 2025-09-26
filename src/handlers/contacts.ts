import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { ArivoApiClient } from '../utils/http';

export interface Contact {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  [key: string]: any;
}

export class ContactsHandler {
  constructor(private apiClient: ArivoApiClient) {}

  async listContacts(args: any = {}): Promise<Contact[]> {
    const params: Record<string, any> = {};

    if (args.limit) params.limit = args.limit;
    if (args.offset) params.offset = args.offset;
    if (args.search) params.search = args.search;

    return await this.apiClient.get<Contact[]>('/contacts', params);
  }

  async getContact(args: { id: number }): Promise<Contact> {
    if (!args.id) {
      throw new Error('Contact ID is required');
    }
    return await this.apiClient.get<Contact>(`/contacts/${args.id}`);
  }

  async createContact(args: { contact: Partial<Contact> }): Promise<Contact> {
    if (!args.contact || !args.contact.name) {
      throw new Error('Contact name is required');
    }
    return await this.apiClient.post<Contact>('/contacts', args.contact);
  }

  async updateContact(args: { id: number; contact: Partial<Contact> }): Promise<Contact> {
    if (!args.id) {
      throw new Error('Contact ID is required');
    }
    if (!args.contact) {
      throw new Error('Contact data is required');
    }
    return await this.apiClient.put<Contact>(`/contacts/${args.id}`, args.contact);
  }

  async deleteContact(args: { id: number }): Promise<{ success: boolean }> {
    if (!args.id) {
      throw new Error('Contact ID is required');
    }
    await this.apiClient.delete(`/contacts/${args.id}`);
    return { success: true };
  }
}

export const contactsToolDefinitions = [
  {
    name: 'list_contacts',
    description: 'List all contacts with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum number of contacts to return' },
        offset: { type: 'number', description: 'Number of contacts to skip' },
        search: { type: 'string', description: 'Search term to filter contacts' }
      }
    }
  },
  {
    name: 'get_contact',
    description: 'Get a specific contact by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Contact ID' }
      },
      required: ['id']
    }
  },
  {
    name: 'create_contact',
    description: 'Create a new contact',
    inputSchema: {
      type: 'object',
      properties: {
        contact: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Contact name' },
            email: { type: 'string', description: 'Contact email' },
            phone: { type: 'string', description: 'Contact phone' },
            company: { type: 'string', description: 'Contact company' }
          },
          required: ['name']
        }
      },
      required: ['contact']
    }
  },
  {
    name: 'update_contact',
    description: 'Update an existing contact',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Contact ID' },
        contact: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Contact name' },
            email: { type: 'string', description: 'Contact email' },
            phone: { type: 'string', description: 'Contact phone' },
            company: { type: 'string', description: 'Contact company' }
          }
        }
      },
      required: ['id', 'contact']
    }
  },
  {
    name: 'delete_contact',
    description: 'Delete a contact',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Contact ID' }
      },
      required: ['id']
    }
  }
];