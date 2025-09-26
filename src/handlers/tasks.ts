import { ArivoApiClient } from '../utils/http';

export interface TaskRecurrence {
  id?: number;
  object?: string;
  created_at?: string;
  updated_at?: string;
  frequency: number;
  interval?: number;
  ends_on?: number;
  repeat?: number;
  sunday?: boolean;
  monday?: boolean;
  tuesday?: boolean;
  wednesday?: boolean;
  thursday?: boolean;
  friday?: boolean;
  saturday?: boolean;
}

export interface Task {
  id?: number;
  object?: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  done?: boolean;
  task_type_id?: number;
  due_type_id?: number;
  due_date?: string;
  due_date_end?: string;
  completed_at?: string;
  comment?: string;
  contact_id?: number;
  deal_id?: number;
  task_recurrence?: TaskRecurrence;
  tags?: string[];
  team_id?: number;
  user_id?: number;
  creator_id?: number;
  [key: string]: any;
}

export class TasksHandler {
  constructor(private apiClient: ArivoApiClient) {}

  async listTasks(args: any = {}): Promise<Task[]> {
    const params: Record<string, any> = {};

    if (args.limit) params.per_page = args.limit;
    if (args.offset) params.offset = args.offset;
    if (args.sort_field) params.sort_field = args.sort_field;
    if (args.sort_order) params.sort_order = args.sort_order;
    if (args.name) params.name = args.name;
    if (args.done !== undefined) params.done = args.done;
    if (args.task_type_id) params.task_type_id = args.task_type_id;
    if (args.contact_id) params.contact_id = args.contact_id;
    if (args.deal_id) params.deal_id = args.deal_id;
    if (args.tags) params.tags = args.tags;
    if (args.user_id) params.user_id = args.user_id;
    if (args.creator_id) params.creator_id = args.creator_id;
    if (args.team_id) params.team_id = args.team_id;
    if (args.search) params.search = args.search;
    if (args.status) params.status = args.status; // Keep for backward compatibility

    return await this.apiClient.get<Task[]>('/tasks', params);
  }

  async getTask(args: { id: number }): Promise<Task> {
    if (!args.id) {
      throw new Error('Task ID is required');
    }
    return await this.apiClient.get<Task>(`/tasks/${args.id}`);
  }

  async createTask(args: { task: Partial<Task> }): Promise<Task> {
    if (!args.task || !args.task.name) {
      throw new Error('Task name is required');
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
        sort_field: { type: 'string', description: 'Field to sort by (created_at, updated_at, due_date, completed_at)' },
        sort_order: { type: 'string', description: 'Sort order (asc, desc)' },
        name: { type: 'string', description: 'Filter by task name' },
        done: { type: 'boolean', description: 'Filter by completion status' },
        task_type_id: { type: 'number', description: 'Filter by task type ID' },
        contact_id: { type: 'number', description: 'Filter by contact ID' },
        deal_id: { type: 'number', description: 'Filter by deal ID' },
        tags: { type: 'string', description: 'Filter by tags (comma-separated)' },
        user_id: { type: 'number', description: 'Filter by user ID' },
        creator_id: { type: 'number', description: 'Filter by creator ID' },
        team_id: { type: 'number', description: 'Filter by team ID' },
        status: { type: 'string', description: 'Filter by task status (deprecated, use done)' },
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
            name: { type: 'string', description: 'Task name' },
            done: { type: 'boolean', description: 'Task completion status' },
            task_type_id: { type: 'number', description: 'Task type ID' },
            due_type_id: { type: 'number', description: 'Due type ID' },
            due_date: { type: 'string', description: 'Due date (ISO 8601 format)' },
            due_date_end: { type: 'string', description: 'Due date end (ISO 8601 format)' },
            comment: { type: 'string', description: 'Task comment/description' },
            contact_id: { type: 'number', description: 'Associated contact ID' },
            deal_id: { type: 'number', description: 'Associated deal ID' },
            task_recurrence: {
              type: 'object',
              description: 'Task recurrence settings',
              properties: {
                frequency: { type: 'number', description: 'Recurrence frequency' },
                interval: { type: 'number', description: 'Recurrence interval' },
                ends_on: { type: 'number', description: 'Recurrence end type' },
                repeat: { type: 'number', description: 'Number of repetitions' },
                sunday: { type: 'boolean', description: 'Repeat on Sunday' },
                monday: { type: 'boolean', description: 'Repeat on Monday' },
                tuesday: { type: 'boolean', description: 'Repeat on Tuesday' },
                wednesday: { type: 'boolean', description: 'Repeat on Wednesday' },
                thursday: { type: 'boolean', description: 'Repeat on Thursday' },
                friday: { type: 'boolean', description: 'Repeat on Friday' },
                saturday: { type: 'boolean', description: 'Repeat on Saturday' }
              },
              required: ['frequency']
            },
            tags: {
              type: 'array',
              description: 'Array of tags',
              items: { type: 'string' }
            },
            user_id: { type: 'number', description: 'Assigned user ID' },
            team_id: { type: 'number', description: 'Assigned team ID' }
          },
          required: ['name']
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
            name: { type: 'string', description: 'Task name' },
            done: { type: 'boolean', description: 'Task completion status' },
            task_type_id: { type: 'number', description: 'Task type ID' },
            due_type_id: { type: 'number', description: 'Due type ID' },
            due_date: { type: 'string', description: 'Due date (ISO 8601 format)' },
            due_date_end: { type: 'string', description: 'Due date end (ISO 8601 format)' },
            comment: { type: 'string', description: 'Task comment/description' },
            contact_id: { type: 'number', description: 'Associated contact ID' },
            deal_id: { type: 'number', description: 'Associated deal ID' },
            task_recurrence: {
              type: 'object',
              description: 'Task recurrence settings',
              properties: {
                frequency: { type: 'number', description: 'Recurrence frequency' },
                interval: { type: 'number', description: 'Recurrence interval' },
                ends_on: { type: 'number', description: 'Recurrence end type' },
                repeat: { type: 'number', description: 'Number of repetitions' },
                sunday: { type: 'boolean', description: 'Repeat on Sunday' },
                monday: { type: 'boolean', description: 'Repeat on Monday' },
                tuesday: { type: 'boolean', description: 'Repeat on Tuesday' },
                wednesday: { type: 'boolean', description: 'Repeat on Wednesday' },
                thursday: { type: 'boolean', description: 'Repeat on Thursday' },
                friday: { type: 'boolean', description: 'Repeat on Friday' },
                saturday: { type: 'boolean', description: 'Repeat on Saturday' }
              },
              required: ['frequency']
            },
            tags: {
              type: 'array',
              description: 'Array of tags',
              items: { type: 'string' }
            },
            user_id: { type: 'number', description: 'Assigned user ID' },
            team_id: { type: 'number', description: 'Assigned team ID' }
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