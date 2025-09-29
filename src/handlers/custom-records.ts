import { ArivoApiClient } from '../utils/http';

export interface CustomRecord {
  id: number;
  object?: string;
  created_at?: string;
  updated_at?: string;
  deal_id?: number;
  contact_id?: number;
  tags?: string[];
  custom_fields?: Record<string, any>;
  team_id?: number;
  user_id?: number;
}

export class CustomRecordsHandler {
  constructor(private apiClient: ArivoApiClient) {}

  async listCustomRecords(args: {
    definition_id: number;
    limit?: number;
    offset?: number;
    contact_id?: number;
    deal_id?: number;
    user_id?: number;
    team_id?: number;
    tags?: string;
    sort_field?: string;
    sort_order?: string;
  }): Promise<CustomRecord[]> {
    const queryParams = new URLSearchParams();

    if (args.limit) queryParams.append('per_page', args.limit.toString());
    if (args.offset) queryParams.append('offset', args.offset.toString());
    if (args.contact_id) queryParams.append('contact_id', args.contact_id.toString());
    if (args.deal_id) queryParams.append('deal_id', args.deal_id.toString());
    if (args.user_id) queryParams.append('user_id', args.user_id.toString());
    if (args.team_id) queryParams.append('team_id', args.team_id.toString());
    if (args.tags) queryParams.append('tags', args.tags);
    if (args.sort_field) queryParams.append('sort_field', args.sort_field);
    if (args.sort_order) queryParams.append('sort_order', args.sort_order);

    const url = `/custom_record_definitions/${args.definition_id}/custom_records${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await this.apiClient.get<CustomRecord[]>(url);
  }

  async getCustomRecord(args: { definition_id: number; id: number }): Promise<CustomRecord> {
    return await this.apiClient.get<CustomRecord>(`/custom_record_definitions/${args.definition_id}/custom_records/${args.id}`);
  }

  async createCustomRecord(args: {
    definition_id: number;
    custom_record: {
      deal_id?: number;
      contact_id?: number;
      tags?: string[];
      custom_fields?: Record<string, any>;
      team_id?: number;
      user_id?: number;
    };
  }): Promise<CustomRecord> {
    if (!args.custom_record) {
      throw new Error('Custom record data is required');
    }
    return await this.apiClient.post<CustomRecord>(`/custom_record_definitions/${args.definition_id}/custom_records`, args.custom_record);
  }

  async updateCustomRecord(args: {
    definition_id: number;
    id: number;
    custom_record: {
      deal_id?: number;
      contact_id?: number;
      tags?: string[];
      custom_fields?: Record<string, any>;
      team_id?: number;
      user_id?: number;
    };
  }): Promise<CustomRecord> {
    return await this.apiClient.put<CustomRecord>(`/custom_record_definitions/${args.definition_id}/custom_records/${args.id}`, args.custom_record);
  }

  async deleteCustomRecord(args: { definition_id: number; id: number }): Promise<void> {
    await this.apiClient.delete(`/custom_record_definitions/${args.definition_id}/custom_records/${args.id}`);
  }
}

export const customRecordsToolDefinitions = [
  {
    name: 'list_custom_records',
    description: 'List custom records for a specific custom record definition',
    inputSchema: {
      type: 'object',
      properties: {
        definition_id: { type: 'number', description: 'Custom record definition ID' },
        limit: { type: 'number', description: 'Maximum number of custom records to return' },
        offset: { type: 'number', description: 'Number of custom records to skip' },
        contact_id: { type: 'number', description: 'Filter by contact ID' },
        deal_id: { type: 'number', description: 'Filter by deal ID' },
        user_id: { type: 'number', description: 'Filter by user ID' },
        team_id: { type: 'number', description: 'Filter by team ID' },
        tags: { type: 'string', description: 'Filter by tags (comma-separated)' },
        sort_field: { type: 'string', description: 'Field to sort by (created_at, updated_at)' },
        sort_order: { type: 'string', description: 'Sort order (asc, desc)' }
      },
      required: ['definition_id']
    }
  },
  {
    name: 'get_custom_record',
    description: 'Get a specific custom record by definition ID and record ID',
    inputSchema: {
      type: 'object',
      properties: {
        definition_id: { type: 'number', description: 'Custom record definition ID' },
        id: { type: 'number', description: 'Custom record ID' }
      },
      required: ['definition_id', 'id']
    }
  },
  {
    name: 'create_custom_record',
    description: 'Create a new custom record',
    inputSchema: {
      type: 'object',
      properties: {
        definition_id: { type: 'number', description: 'Custom record definition ID' },
        custom_record: {
          type: 'object',
          properties: {
            deal_id: { type: 'number', description: 'Associated deal ID' },
            contact_id: { type: 'number', description: 'Associated contact ID' },
            tags: { type: 'array', items: { type: 'string' }, description: 'Array of tags' },
            custom_fields: { type: 'object', description: 'Custom fields as key-value pairs' },
            team_id: { type: 'number', description: 'Assigned team ID' },
            user_id: { type: 'number', description: 'Assigned user ID' }
          }
        }
      },
      required: ['definition_id', 'custom_record']
    }
  },
  {
    name: 'update_custom_record',
    description: 'Update an existing custom record',
    inputSchema: {
      type: 'object',
      properties: {
        definition_id: { type: 'number', description: 'Custom record definition ID' },
        id: { type: 'number', description: 'Custom record ID' },
        custom_record: {
          type: 'object',
          properties: {
            deal_id: { type: 'number', description: 'Associated deal ID' },
            contact_id: { type: 'number', description: 'Associated contact ID' },
            tags: { type: 'array', items: { type: 'string' }, description: 'Array of tags' },
            custom_fields: { type: 'object', description: 'Custom fields as key-value pairs' },
            team_id: { type: 'number', description: 'Assigned team ID' },
            user_id: { type: 'number', description: 'Assigned user ID' }
          }
        }
      },
      required: ['definition_id', 'id', 'custom_record']
    }
  },
  {
    name: 'delete_custom_record',
    description: 'Delete a custom record',
    inputSchema: {
      type: 'object',
      properties: {
        definition_id: { type: 'number', description: 'Custom record definition ID' },
        id: { type: 'number', description: 'Custom record ID' }
      },
      required: ['definition_id', 'id']
    }
  }
];