import { ArivoApiClient } from '../utils/http';

export interface CustomFieldDefinition {
  label: string;
  field_type: string;
}

export interface CustomRecordDefinition {
  id: number;
  object?: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  definitions?: Record<string, CustomFieldDefinition>;
}

export class CustomRecordDefinitionsHandler {
  constructor(private apiClient: ArivoApiClient) {}

  async listCustomRecordDefinitions(params?: {
    limit?: number;
    offset?: number;
    name?: string;
    sort_field?: string;
    sort_order?: string;
  }): Promise<CustomRecordDefinition[]> {
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.append('per_page', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.name) queryParams.append('name', params.name);
    if (params?.sort_field) queryParams.append('sort_field', params.sort_field);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);

    const url = `/custom_record_definitions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await this.apiClient.get<CustomRecordDefinition[]>(url);
  }

  async getCustomRecordDefinition(id: number): Promise<CustomRecordDefinition> {
    return await this.apiClient.get<CustomRecordDefinition>(`/custom_record_definitions/${id}`);
  }

  async createCustomRecordDefinition(args: { custom_record_definition: Omit<CustomRecordDefinition, 'id' | 'object' | 'created_at' | 'updated_at' | 'definitions'> }): Promise<CustomRecordDefinition> {
    if (!args.custom_record_definition || !args.custom_record_definition.name) {
      throw new Error('Custom record definition name is required');
    }
    return await this.apiClient.post<CustomRecordDefinition>('/custom_record_definitions', args.custom_record_definition);
  }

  async updateCustomRecordDefinition(args: { id: number; custom_record_definition: Partial<Omit<CustomRecordDefinition, 'id' | 'object' | 'created_at' | 'updated_at' | 'definitions'>> }): Promise<CustomRecordDefinition> {
    return await this.apiClient.put<CustomRecordDefinition>(`/custom_record_definitions/${args.id}`, args.custom_record_definition);
  }

  async deleteCustomRecordDefinition(id: number): Promise<void> {
    await this.apiClient.delete(`/custom_record_definitions/${id}`);
  }
}

export const customRecordDefinitionsToolDefinitions = [
  {
    name: 'list_custom_record_definitions',
    description: 'List all custom record definitions with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum number of custom record definitions to return' },
        offset: { type: 'number', description: 'Number of custom record definitions to skip' },
        name: { type: 'string', description: 'Filter by custom record definition name' },
        sort_field: { type: 'string', description: 'Field to sort by (name, created_at, updated_at)' },
        sort_order: { type: 'string', description: 'Sort order (asc, desc)' }
      }
    }
  },
  {
    name: 'get_custom_record_definition',
    description: 'Get a specific custom record definition by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Custom record definition ID' }
      },
      required: ['id']
    }
  },
  {
    name: 'create_custom_record_definition',
    description: 'Create a new custom record definition',
    inputSchema: {
      type: 'object',
      properties: {
        custom_record_definition: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Custom record definition name' }
          },
          required: ['name']
        }
      },
      required: ['custom_record_definition']
    }
  },
  {
    name: 'update_custom_record_definition',
    description: 'Update an existing custom record definition',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Custom record definition ID' },
        custom_record_definition: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Custom record definition name' }
          }
        }
      },
      required: ['id', 'custom_record_definition']
    }
  },
  {
    name: 'delete_custom_record_definition',
    description: 'Delete a custom record definition',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Custom record definition ID' }
      },
      required: ['id']
    }
  }
];