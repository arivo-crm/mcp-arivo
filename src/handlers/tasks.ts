import { ArivoApiClient } from '../utils/http';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  due_date?: string;
  status?: string;
  contact_id?: number;
  deal_id?: number;
  [key: string]: any;
}

export class TasksHandler {
  constructor(private apiClient: ArivoApiClient) {}

  async listTasks(args: any = {}): Promise<Task[]> {
    const params: Record<string, any> = {};

    if (args.limit) params.limit = args.limit;
    if (args.offset) params.offset = args.offset;
    if (args.status) params.status = args.status;
    if (args.contact_id) params.contact_id = args.contact_id;
    if (args.deal_id) params.deal_id = args.deal_id;
    if (args.search) params.search = args.search;

    return await this.apiClient.get<Task[]>('/tasks', params);
  }

  async getTask(args: { id: number }): Promise<Task> {
    if (!args.id) {
      throw new Error('Task ID is required');
    }
    return await this.apiClient.get<Task>(`/tasks/${args.id}`);
  }

  async createTask(args: { task: Partial<Task> }): Promise<Task> {
    if (!args.task || !args.task.title) {
      throw new Error('Task title is required');
    }
    return await this.apiClient.post<Task>('/tasks', args.task);
  }

  async updateTask(args: { id: number; task: Partial<Task> }): Promise<Task> {
    if (!args.id) {
      throw new Error('Task ID is required');
    }
    if (!args.task) {
      throw new Error('Task data is required');
    }
    return await this.apiClient.put<Task>(`/tasks/${args.id}`, args.task);
  }

  async deleteTask(args: { id: number }): Promise<{ success: boolean }> {
    if (!args.id) {
      throw new Error('Task ID is required');
    }
    await this.apiClient.delete(`/tasks/${args.id}`);
    return { success: true };
  }
}

export const tasksToolDefinitions = [
  {
    name: 'list_tasks',
    description: 'List all tasks with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum number of tasks to return' },
        offset: { type: 'number', description: 'Number of tasks to skip' },
        status: { type: 'string', description: 'Filter by task status' },
        contact_id: { type: 'number', description: 'Filter by contact ID' },
        deal_id: { type: 'number', description: 'Filter by deal ID' },
        search: { type: 'string', description: 'Search term to filter tasks' }
      }
    }
  },
  {
    name: 'get_task',
    description: 'Get a specific task by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Task ID' }
      },
      required: ['id']
    }
  },
  {
    name: 'create_task',
    description: 'Create a new task',
    inputSchema: {
      type: 'object',
      properties: {
        task: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Task title' },
            description: { type: 'string', description: 'Task description' },
            due_date: { type: 'string', description: 'Due date (YYYY-MM-DD)' },
            status: { type: 'string', description: 'Task status' },
            contact_id: { type: 'number', description: 'Associated contact ID' },
            deal_id: { type: 'number', description: 'Associated deal ID' }
          },
          required: ['title']
        }
      },
      required: ['task']
    }
  },
  {
    name: 'update_task',
    description: 'Update an existing task',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Task ID' },
        task: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Task title' },
            description: { type: 'string', description: 'Task description' },
            due_date: { type: 'string', description: 'Due date (YYYY-MM-DD)' },
            status: { type: 'string', description: 'Task status' },
            contact_id: { type: 'number', description: 'Associated contact ID' },
            deal_id: { type: 'number', description: 'Associated deal ID' }
          }
        }
      },
      required: ['id', 'task']
    }
  },
  {
    name: 'delete_task',
    description: 'Delete a task',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Task ID' }
      },
      required: ['id']
    }
  }
];