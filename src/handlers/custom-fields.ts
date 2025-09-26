import { ArivoApiClient } from '../utils/http';

export interface CustomField {
  label: string;
  field_type: 'string' | 'date' | 'number' | 'list';
  order?: number;
  list?: string[];
}

export interface CustomFieldsResponse {
  [fieldName: string]: CustomField;
}

export class CustomFieldsHandler {
  constructor(private apiClient: ArivoApiClient) {}

  async getCustomFields(args: { id: string }): Promise<CustomFieldsResponse> {
    if (!args.id) {
      throw new Error('Record type ID is required');
    }

    // Validate the ID parameter
    const validIds = ['person', 'company', 'deal'];
    if (!validIds.includes(args.id) && !/^\d+$/.test(args.id)) {
      throw new Error('Invalid record type ID. Must be "person", "company", "deal" or a custom record type ID');
    }

    return await this.apiClient.get<CustomFieldsResponse>(`/custom_fields/${args.id}`);
  }
}

export const customFieldsToolDefinitions = [
  {
    name: 'get_custom_fields',
    description: 'Get custom fields data for a specific record type (person, company, deal, or custom record type)',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Record type identifier. Values: "person", "company", "deal" or custom record type ID'
        }
      },
      required: ['id']
    }
  }
];