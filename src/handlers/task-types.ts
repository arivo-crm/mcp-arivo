import { ArivoApiClient } from '../utils/http';

export interface TaskType {
  id: number;
  label: string;
}

export class TaskTypesHandler {
  constructor(private apiClient: ArivoApiClient) {}

  async listTaskTypes(): Promise<TaskType[]> {
    return await this.apiClient.get<TaskType[]>('/task_types');
  }
}

export const taskTypesToolDefinitions = [
  {
    name: 'list_task_types',
    description: 'List all available task types that can be created in Arivo CRM',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];