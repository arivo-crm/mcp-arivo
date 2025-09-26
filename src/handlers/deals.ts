import { ArivoApiClient } from '../utils/http';

export interface Deal {
  id?: number;
  title: string;
  value?: number;
  stage?: string;
  contact_id?: number;
  expected_close_date?: string;
  [key: string]: any;
}

export class DealsHandler {
  constructor(private apiClient: ArivoApiClient) {}

  async listDeals(args: any = {}): Promise<Deal[]> {
    const params: Record<string, any> = {};

    if (args.limit) params.limit = args.limit;
    if (args.offset) params.offset = args.offset;
    if (args.stage) params.stage = args.stage;
    if (args.search) params.search = args.search;

    return await this.apiClient.get<Deal[]>('/deals', params);
  }

  async getDeal(args: { id: number }): Promise<Deal> {
    if (!args.id) {
      throw new Error('Deal ID is required');
    }
    return await this.apiClient.get<Deal>(`/deals/${args.id}`);
  }

  async createDeal(args: { deal: Partial<Deal> }): Promise<Deal> {
    if (!args.deal || !args.deal.title) {
      throw new Error('Deal title is required');
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
        stage: { type: 'string', description: 'Filter by deal stage' },
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
            title: { type: 'string', description: 'Deal title' },
            value: { type: 'number', description: 'Deal value' },
            stage: { type: 'string', description: 'Deal stage' },
            contact_id: { type: 'number', description: 'Associated contact ID' },
            expected_close_date: { type: 'string', description: 'Expected close date (YYYY-MM-DD)' }
          },
          required: ['title']
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
            title: { type: 'string', description: 'Deal title' },
            value: { type: 'number', description: 'Deal value' },
            stage: { type: 'string', description: 'Deal stage' },
            contact_id: { type: 'number', description: 'Associated contact ID' },
            expected_close_date: { type: 'string', description: 'Expected close date (YYYY-MM-DD)' }
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