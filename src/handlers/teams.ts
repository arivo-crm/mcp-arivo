import { ArivoApiClient } from '../utils/http';

export interface Team {
  id?: number;
  object?: string;
  created_at?: string;
  updated_at?: string;
  name: string;
}

export class TeamsHandler {
  constructor(private apiClient: ArivoApiClient) {}

  async listTeams(args: any = {}): Promise<Team[]> {
    const params: Record<string, any> = {};

    if (args.limit) params.per_page = args.limit;
    if (args.offset) params.offset = args.offset;
    if (args.sort_field) params.sort_field = args.sort_field;
    if (args.sort_order) params.sort_order = args.sort_order;
    if (args.name) params.name = args.name;

    return await this.apiClient.get<Team[]>('/teams', params);
  }

  async getTeam(args: { id: number }): Promise<Team> {
    if (!args.id) {
      throw new Error('Team ID is required');
    }
    return await this.apiClient.get<Team>(`/teams/${args.id}`);
  }
}

export const teamsToolDefinitions = [
  {
    name: 'list_teams',
    description: 'List all teams with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum number of teams to return' },
        offset: { type: 'number', description: 'Number of teams to skip' },
        sort_field: { type: 'string', description: 'Field to sort by (name, created_at, updated_at)' },
        sort_order: { type: 'string', description: 'Sort order (asc, desc)' },
        name: { type: 'string', description: 'Filter by team name' }
      }
    }
  },
  {
    name: 'get_team',
    description: 'Get a specific team by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Team ID' }
      },
      required: ['id']
    }
  }
];