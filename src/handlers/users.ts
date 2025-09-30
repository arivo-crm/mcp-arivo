import { ArivoApiClient } from '../utils/http';

export interface User {
  id?: number;
  object?: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  email?: string;
  role?: number;
  team_id?: number;
}

export class UsersHandler {
  constructor(private apiClient: ArivoApiClient) {}

  async listUsers(args: any = {}): Promise<User[]> {
    const params: Record<string, any> = {};

    if (args.limit) params.per_page = args.limit;
    if (args.offset) params.offset = args.offset;
    if (args.sort_field) params.sort_field = args.sort_field;
    if (args.sort_order) params.sort_order = args.sort_order;
    if (args.name) params.name = args.name;
    if (args.role !== undefined) params.role = args.role;
    if (args.email) params.email = args.email;
    if (args.team_id) params.team_id = args.team_id;

    return await this.apiClient.get<User[]>('/users', params);
  }

  async getUser(args: { id: number }): Promise<User> {
    if (!args.id) {
      throw new Error('User ID is required');
    }
    return await this.apiClient.get<User>(`/users/${args.id}`);
  }
}

export const usersToolDefinitions = [
  {
    name: 'list_users',
    description: 'List all users with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum number of users to return' },
        offset: { type: 'number', description: 'Number of users to skip' },
        sort_field: { type: 'string', description: 'Field to sort by (name, email, created_at, updated_at)' },
        sort_order: { type: 'string', description: 'Sort order (asc, desc)' },
        name: { type: 'string', description: 'Filter by user name' },
        role: { type: 'number', description: 'Filter by user role (1: Admin, 2: User, 3: Team Manager)' },
        email: { type: 'string', description: 'Filter by user email' },
        team_id: { type: 'number', description: 'Filter by team ID' }
      }
    }
  },
  {
    name: 'get_user',
    description: 'Get a specific user by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'User ID' }
      },
      required: ['id']
    }
  }
];