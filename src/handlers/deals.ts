import { ArivoApiClient } from '../utils/http';

export interface QuoteItem {
  id?: number;
  object?: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  deal_id?: number;
  product_id?: number;
  price: number;
  quantity: number;
  discount?: number;
  total_price?: number;
}

export interface Deal {
  id?: number;
  object?: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  description?: string;
  value?: number;
  company_id?: number;
  contact_id?: number;
  status?: string;
  temperature?: string;
  opened_at?: string;
  estimated_close_date?: string;
  closed_at?: string;
  pipeline_id?: number;
  pipeline_step_id?: number;
  quote_items?: QuoteItem[];
  tags?: string[];
  custom_fields?: Record<string, any>;
  team_id?: number;
  user_id?: number;
  [key: string]: any;
}

export class DealsHandler {
  constructor(private apiClient: ArivoApiClient) {}

  async listDeals(args: any = {}): Promise<Deal[]> {
    const params: Record<string, any> = {};

    if (args.limit) params.per_page = args.limit;
    if (args.offset) params.offset = args.offset;
    if (args.sort_field) params.sort_field = args.sort_field;
    if (args.sort_order) params.sort_order = args.sort_order;
    if (args.status) params.status = args.status;
    if (args.temperature) params.temperature = args.temperature;
    if (args.pipeline_id) params.pipeline_id = args.pipeline_id;
    if (args.pipeline_step_id) params.pipeline_step_id = args.pipeline_step_id;
    if (args.name) params.name = args.name;
    if (args.company_id) params.company_id = args.company_id;
    if (args.contact_id) params.contact_id = args.contact_id;
    if (args.tags) params.tags = args.tags;
    if (args.user_id) params.user_id = args.user_id;
    if (args.team_id) params.team_id = args.team_id;
    if (args.search) params.search = args.search;
    if (args.stage) params.stage = args.stage; // Keep for backward compatibility

    return await this.apiClient.get<Deal[]>('/deals', params);
  }

  async getDeal(args: { id: number }): Promise<Deal> {
    if (!args.id) {
      throw new Error('Deal ID is required');
    }
    return await this.apiClient.get<Deal>(`/deals/${args.id}`);
  }

  async createDeal(args: { deal: Partial<Deal> }): Promise<Deal> {
    if (!args.deal || !args.deal.name) {
      throw new Error('Deal name is required');
    }
    return await this.apiClient.post<Deal>('/deals', args.deal);
  }

  async updateDeal(args: { id: number; deal: Partial<Deal> }): Promise<Deal> {
    if (!args.id) {
      throw new Error('Deal ID is required');
    }
    if (!args.deal) {
      throw new Error('Deal data is required');
    }
    return await this.apiClient.put<Deal>(`/deals/${args.id}`, args.deal);
  }

  async deleteDeal(args: { id: number }): Promise<{ success: boolean }> {
    if (!args.id) {
      throw new Error('Deal ID is required');
    }
    await this.apiClient.delete(`/deals/${args.id}`);
    return { success: true };
  }
}

export const dealsToolDefinitions = [
  {
    name: 'list_deals',
    description: 'List all deals with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum number of deals to return' },
        offset: { type: 'number', description: 'Number of deals to skip' },
        sort_field: { type: 'string', description: 'Field to sort by (created_at, updated_at, name, value, temperature, opened_at, estimated_close_date, closed_at)' },
        sort_order: { type: 'string', description: 'Sort order (asc, desc)' },
        status: { type: 'string', description: 'Filter by deal status (open, won, lost)' },
        temperature: { type: 'string', description: 'Filter by deal temperature (cold, warm, hot)' },
        pipeline_id: { type: 'number', description: 'Filter by pipeline ID' },
        pipeline_step_id: { type: 'number', description: 'Filter by pipeline step ID' },
        name: { type: 'string', description: 'Filter by deal name' },
        company_id: { type: 'number', description: 'Filter by company ID' },
        contact_id: { type: 'number', description: 'Filter by contact ID' },
        tags: { type: 'string', description: 'Filter by tags (comma-separated)' },
        user_id: { type: 'number', description: 'Filter by user ID' },
        team_id: { type: 'number', description: 'Filter by team ID' },
        stage: { type: 'string', description: 'Filter by deal stage (deprecated, use status)' },
        search: { type: 'string', description: 'Search term to filter deals' }
      }
    }
  },
  {
    name: 'get_deal',
    description: 'Get a specific deal by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Deal ID' }
      },
      required: ['id']
    }
  },
  {
    name: 'create_deal',
    description: 'Create a new deal',
    inputSchema: {
      type: 'object',
      properties: {
        deal: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Deal name' },
            description: { type: 'string', description: 'Deal description' },
            value: { type: 'number', description: 'Deal value' },
            company_id: { type: 'number', description: 'Associated company ID' },
            contact_id: { type: 'number', description: 'Associated contact ID' },
            status: { type: 'string', description: 'Deal status (open, won, lost)' },
            temperature: { type: 'string', description: 'Deal temperature (cold, warm, hot)' },
            estimated_close_date: { type: 'string', description: 'Expected close date (YYYY-MM-DD)' },
            pipeline_id: { type: 'number', description: 'Pipeline ID' },
            pipeline_step_id: { type: 'number', description: 'Pipeline step ID' },
            quote_items: {
              type: 'array',
              description: 'Array of quote items',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: 'Item name' },
                  product_id: { type: 'number', description: 'Product ID' },
                  price: { type: 'number', description: 'Item price' },
                  quantity: { type: 'number', description: 'Item quantity' },
                  discount: { type: 'number', description: 'Discount percentage' }
                },
                required: ['name', 'price', 'quantity']
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
      required: ['deal']
    }
  },
  {
    name: 'update_deal',
    description: 'Update an existing deal',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Deal ID' },
        deal: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Deal name' },
            description: { type: 'string', description: 'Deal description' },
            value: { type: 'number', description: 'Deal value' },
            company_id: { type: 'number', description: 'Associated company ID' },
            contact_id: { type: 'number', description: 'Associated contact ID' },
            status: { type: 'string', description: 'Deal status (open, won, lost)' },
            temperature: { type: 'string', description: 'Deal temperature (cold, warm, hot)' },
            estimated_close_date: { type: 'string', description: 'Expected close date (YYYY-MM-DD)' },
            pipeline_id: { type: 'number', description: 'Pipeline ID' },
            pipeline_step_id: { type: 'number', description: 'Pipeline step ID' },
            quote_items: {
              type: 'array',
              description: 'Array of quote items',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number', description: 'Item ID (for updates)' },
                  name: { type: 'string', description: 'Item name' },
                  product_id: { type: 'number', description: 'Product ID' },
                  price: { type: 'number', description: 'Item price' },
                  quantity: { type: 'number', description: 'Item quantity' },
                  discount: { type: 'number', description: 'Discount percentage' }
                },
                required: ['name', 'price', 'quantity']
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
      required: ['id', 'deal']
    }
  },
  {
    name: 'delete_deal',
    description: 'Delete a deal',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Deal ID' }
      },
      required: ['id']
    }
  }
];