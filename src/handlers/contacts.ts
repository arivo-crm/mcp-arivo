import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { ArivoApiClient } from '../utils/http';

export interface Phone {
  id?: number;
  object?: string;
  created_at?: string;
  updated_at?: string;
  number: string;
  phone_type?: string;
  contact_id?: number;
}

export interface Email {
  id?: number;
  object?: string;
  created_at?: string;
  updated_at?: string;
  address: string;
  email_type?: string;
  contact_id?: number;
}

export interface Address {
  id?: number;
  object?: string;
  created_at?: string;
  updated_at?: string;
  street?: string;
  number?: string;
  complement?: string;
  zip_code?: string;
  district?: string;
  city?: string;
  state?: string;
  country?: string;
  contact_id?: number;
}

export interface Contact {
  id?: number;
  object?: string;
  created_at?: string;
  updated_at?: string;
  contact_type?: string;
  name: string;
  birth_date?: string;
  cpf?: string;
  cnpj?: string;
  position?: string;
  company_id?: number;
  website?: string;
  main_contact_id?: number;
  phones?: Phone[];
  emails?: Email[];
  addresses?: Address[];
  tags?: string[];
  custom_fields?: Record<string, any>;
  team_id?: number;
  user_id?: number;
  [key: string]: any;
}

export class ContactsHandler {
  constructor(private apiClient: ArivoApiClient) {}

  async listContacts(args: any = {}): Promise<Contact[]> {
    const params: Record<string, any> = {};

    if (args.limit) params.per_page = args.limit;
    if (args.offset) params.offset = args.offset;
    if (args.sort_field) params.sort_field = args.sort_field;
    if (args.sort_order) params.sort_order = args.sort_order;
    if (args.contact_type) params.contact_type = args.contact_type;
    if (args.name) params.name = args.name;
    if (args.cpf) params.cpf = args.cpf;
    if (args.cnpj) params.cnpj = args.cnpj;
    if (args.email) params.email = args.email;
    if (args.phone) params.phone = args.phone;
    if (args.district) params.district = args.district;
    if (args.zip_code) params.zip_code = args.zip_code;
    if (args.city) params.city = args.city;
    if (args.state) params.state = args.state;
    if (args.country) params.country = args.country;
    if (args.tags) params.tags = args.tags;
    if (args.company_id) params.company_id = args.company_id;
    if (args.user_id) params.user_id = args.user_id;
    if (args.team_id) params.team_id = args.team_id;
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
        sort_field: { type: 'string', description: 'Field to sort by (name, created_at, updated_at)' },
        sort_order: { type: 'string', description: 'Sort order (asc, desc)' },
        contact_type: { type: 'string', description: 'Filter by contact type (person, company)' },
        name: { type: 'string', description: 'Filter by contact name' },
        cpf: { type: 'string', description: 'Filter by CPF number' },
        cnpj: { type: 'string', description: 'Filter by CNPJ number' },
        email: { type: 'string', description: 'Filter by email address' },
        phone: { type: 'string', description: 'Filter by phone number' },
        district: { type: 'string', description: 'Filter by district' },
        zip_code: { type: 'string', description: 'Filter by ZIP code' },
        city: { type: 'string', description: 'Filter by city' },
        state: { type: 'string', description: 'Filter by state' },
        country: { type: 'string', description: 'Filter by country' },
        tags: { type: 'string', description: 'Filter by tags (comma-separated)' },
        company_id: { type: 'number', description: 'Filter by company ID' },
        user_id: { type: 'number', description: 'Filter by user ID' },
        team_id: { type: 'number', description: 'Filter by team ID' },
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
            contact_type: { type: 'string', description: 'Contact type (person or company)' },
            birth_date: { type: 'string', description: 'Birth date (YYYY-MM-DD)' },
            cpf: { type: 'string', description: 'CPF number' },
            cnpj: { type: 'string', description: 'CNPJ number' },
            position: { type: 'string', description: 'Position/job title' },
            company_id: { type: 'number', description: 'Associated company ID' },
            website: { type: 'string', description: 'Website URL' },
            main_contact_id: { type: 'number', description: 'Main contact ID (for companies)' },
            phones: {
              type: 'array',
              description: 'Array of phone numbers',
              items: {
                type: 'object',
                properties: {
                  number: { type: 'string', description: 'Phone number' },
                  phone_type: { type: 'string', description: 'Phone type (home, work, cell)' }
                },
                required: ['number']
              }
            },
            emails: {
              type: 'array',
              description: 'Array of email addresses',
              items: {
                type: 'object',
                properties: {
                  address: { type: 'string', description: 'Email address' },
                  email_type: { type: 'string', description: 'Email type (home, work)' }
                },
                required: ['address']
              }
            },
            addresses: {
              type: 'array',
              description: 'Array of addresses',
              items: {
                type: 'object',
                properties: {
                  street: { type: 'string', description: 'Street name' },
                  number: { type: 'string', description: 'Street number' },
                  complement: { type: 'string', description: 'Address complement' },
                  zip_code: { type: 'string', description: 'ZIP code' },
                  district: { type: 'string', description: 'District' },
                  city: { type: 'string', description: 'City' },
                  state: { type: 'string', description: 'State' },
                  country: { type: 'string', description: 'Country' }
                }
              }
            },
            tags: {
              type: 'array',
              description: 'Array of tags',
              items: { type: 'string' }
            },
            custom_fields: {
              type: 'object',
              description: 'Custom fields as key-value pairs'
            },
            user_id: { type: 'number', description: 'Assigned user ID' },
            team_id: { type: 'number', description: 'Assigned team ID' }
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
            contact_type: { type: 'string', description: 'Contact type (person or company)' },
            birth_date: { type: 'string', description: 'Birth date (YYYY-MM-DD)' },
            cpf: { type: 'string', description: 'CPF number' },
            cnpj: { type: 'string', description: 'CNPJ number' },
            position: { type: 'string', description: 'Position/job title' },
            company_id: { type: 'number', description: 'Associated company ID' },
            website: { type: 'string', description: 'Website URL' },
            main_contact_id: { type: 'number', description: 'Main contact ID (for companies)' },
            phones: {
              type: 'array',
              description: 'Array of phone numbers',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number', description: 'Phone ID (for updates)' },
                  number: { type: 'string', description: 'Phone number' },
                  phone_type: { type: 'string', description: 'Phone type (home, work, cell)' }
                },
                required: ['number']
              }
            },
            emails: {
              type: 'array',
              description: 'Array of email addresses',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number', description: 'Email ID (for updates)' },
                  address: { type: 'string', description: 'Email address' },
                  email_type: { type: 'string', description: 'Email type (home, work)' }
                },
                required: ['address']
              }
            },
            addresses: {
              type: 'array',
              description: 'Array of addresses',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number', description: 'Address ID (for updates)' },
                  street: { type: 'string', description: 'Street name' },
                  number: { type: 'string', description: 'Street number' },
                  complement: { type: 'string', description: 'Address complement' },
                  zip_code: { type: 'string', description: 'ZIP code' },
                  district: { type: 'string', description: 'District' },
                  city: { type: 'string', description: 'City' },
                  state: { type: 'string', description: 'State' },
                  country: { type: 'string', description: 'Country' }
                }
              }
            },
            tags: {
              type: 'array',
              description: 'Array of tags',
              items: { type: 'string' }
            },
            custom_fields: {
              type: 'object',
              description: 'Custom fields as key-value pairs'
            },
            user_id: { type: 'number', description: 'Assigned user ID' },
            team_id: { type: 'number', description: 'Assigned team ID' }
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