import { ArivoApiClient } from '../utils/http';

export interface PipelineStep {
  id?: number;
  object?: string;
  created_at?: string;
  updated_at?: string;
  name: string;
}

export interface Pipeline {
  id?: number;
  object?: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  pipeline_steps?: PipelineStep[];
}

export class PipelinesHandler {
  constructor(private apiClient: ArivoApiClient) {}

  async listPipelines(args: any = {}): Promise<Pipeline[]> {
    const params: Record<string, any> = {};

    if (args.limit) params.per_page = args.limit;
    if (args.offset) params.offset = args.offset;
    if (args.sort_field) params.sort_field = args.sort_field;
    if (args.sort_order) params.sort_order = args.sort_order;

    return await this.apiClient.get<Pipeline[]>('/pipelines', params);
  }

  async getPipeline(args: { id: number }): Promise<Pipeline> {
    if (!args.id) {
      throw new Error('Pipeline ID is required');
    }
    return await this.apiClient.get<Pipeline>(`/pipelines/${args.id}`);
  }
}

export const pipelinesToolDefinitions = [
  {
    name: 'list_pipelines',
    description: 'List all sales pipelines with their steps',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum number of pipelines to return' },
        offset: { type: 'number', description: 'Number of pipelines to skip' },
        sort_field: { type: 'string', description: 'Field to sort by (name, created_at, updated_at)' },
        sort_order: { type: 'string', description: 'Sort order (asc, desc)' }
      }
    }
  },
  {
    name: 'get_pipeline',
    description: 'Get a specific pipeline by ID with all its steps',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Pipeline ID' }
      },
      required: ['id']
    }
  }
];