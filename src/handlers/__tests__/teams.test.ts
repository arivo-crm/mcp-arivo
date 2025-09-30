import { TeamsHandler } from '../teams';
import { MockArivoApiClient } from '../../__tests__/utils/mock-api-client';

describe('TeamsHandler', () => {
  let handler: TeamsHandler;
  let mockClient: MockArivoApiClient;

  beforeEach(() => {
    mockClient = new MockArivoApiClient() as any;
    handler = new TeamsHandler(mockClient as any);
  });

  afterEach(() => {
    mockClient.reset();
  });

  describe('listTeams', () => {
    it('should list teams without filters', async () => {
      const mockTeams = [
        { id: 1, name: 'Sales Team', created_at: '2024-01-01T00:00:00Z' },
        { id: 2, name: 'Support Team', created_at: '2024-01-02T00:00:00Z' },
        { id: 3, name: 'Marketing Team', created_at: '2024-01-03T00:00:00Z' }
      ];
      mockClient.mockGet('/teams', mockTeams);

      const result = await handler.listTeams();

      expect(result).toEqual(mockTeams);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('GET');
      expect(lastCall.path).toBe('/teams');
    });

    it('should list teams with pagination', async () => {
      const mockTeams = [
        { id: 1, name: 'Team 1' }
      ];
      mockClient.mockGet('/teams', mockTeams);

      const result = await handler.listTeams({ limit: 10, offset: 5 });

      expect(result).toEqual(mockTeams);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by name', async () => {
      const mockTeams = [
        { id: 1, name: 'Sales Team' }
      ];
      mockClient.mockGet('/teams', mockTeams);

      const result = await handler.listTeams({ name: 'Sales Team' });

      expect(result).toEqual(mockTeams);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle sorting by name', async () => {
      const mockTeams = [
        { id: 1, name: 'A Team' },
        { id: 2, name: 'B Team' },
        { id: 3, name: 'C Team' }
      ];
      mockClient.mockGet('/teams', mockTeams);

      const result = await handler.listTeams({
        sort_field: 'name',
        sort_order: 'asc'
      });

      expect(result).toEqual(mockTeams);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle sorting by created_at', async () => {
      const mockTeams = [
        { id: 1, name: 'Team 1', created_at: '2024-01-01T00:00:00Z' },
        { id: 2, name: 'Team 2', created_at: '2024-02-01T00:00:00Z' },
        { id: 3, name: 'Team 3', created_at: '2024-03-01T00:00:00Z' }
      ];
      mockClient.mockGet('/teams', mockTeams);

      const result = await handler.listTeams({
        sort_field: 'created_at',
        sort_order: 'desc'
      });

      expect(result).toEqual(mockTeams);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle sorting by updated_at', async () => {
      const mockTeams = [
        { id: 1, name: 'Team 1', updated_at: '2025-01-15T00:00:00Z' },
        { id: 2, name: 'Team 2', updated_at: '2025-01-18T00:00:00Z' }
      ];
      mockClient.mockGet('/teams', mockTeams);

      const result = await handler.listTeams({
        sort_field: 'updated_at',
        sort_order: 'asc'
      });

      expect(result).toEqual(mockTeams);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle multiple filters combined', async () => {
      const mockTeams = [
        { id: 1, name: 'Sales Team' }
      ];
      mockClient.mockGet('/teams', mockTeams);

      const result = await handler.listTeams({
        name: 'Sales Team',
        limit: 20,
        sort_field: 'name',
        sort_order: 'asc'
      });

      expect(result).toEqual(mockTeams);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle empty list response', async () => {
      mockClient.mockGet('/teams', []);

      const result = await handler.listTeams();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getTeam', () => {
    it('should get a team by id', async () => {
      const mockTeam = {
        id: 123,
        object: 'team',
        name: 'Sales Team',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2025-01-20T14:00:00Z'
      };
      mockClient.mockGet('/teams/123', mockTeam);

      const result = await handler.getTeam({ id: 123 });

      expect(result).toEqual(mockTeam);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('GET');
      expect(lastCall.path).toBe('/teams/123');
    });

    it('should handle team with minimal fields', async () => {
      const mockTeam = {
        id: 456,
        name: 'Support Team'
      };
      mockClient.mockGet('/teams/456', mockTeam);

      const result = await handler.getTeam({ id: 456 });

      expect(result.id).toBe(456);
      expect(result.name).toBe('Support Team');
    });

    it('should handle team with all fields', async () => {
      const mockTeam = {
        id: 789,
        object: 'team',
        name: 'Engineering Team',
        created_at: '2023-06-01T08:00:00Z',
        updated_at: '2025-01-20T16:30:00Z'
      };
      mockClient.mockGet('/teams/789', mockTeam);

      const result = await handler.getTeam({ id: 789 });

      expect(result.object).toBe('team');
      expect(result.created_at).toBe('2023-06-01T08:00:00Z');
      expect(result.updated_at).toBe('2025-01-20T16:30:00Z');
    });

    it('should throw error if id is missing', async () => {
      await expect(
        handler.getTeam({ id: undefined as any })
      ).rejects.toThrow('Team ID is required');
    });
  });

  describe('error handling', () => {
    it('should handle errors when listing teams', async () => {
      const error = new Error('Network error');
      mockClient.mockError('GET', '/teams', error);

      await expect(handler.listTeams()).rejects.toThrow('Network error');
    });

    it('should handle errors when getting a team', async () => {
      const error = new Error('Not found');
      mockClient.mockError('GET', '/teams/999', error);

      await expect(handler.getTeam({ id: 999 })).rejects.toThrow('Not found');
    });

    it('should handle unauthorized errors', async () => {
      const error = new Error('Unauthorized');
      mockClient.mockError('GET', '/teams', error);

      await expect(handler.listTeams()).rejects.toThrow('Unauthorized');
    });

    it('should handle forbidden errors', async () => {
      const error = new Error('Forbidden');
      mockClient.mockError('GET', '/teams/123', error);

      await expect(handler.getTeam({ id: 123 })).rejects.toThrow('Forbidden');
    });

    it('should handle server errors', async () => {
      const error = new Error('Internal server error');
      mockClient.mockError('GET', '/teams', error);

      await expect(handler.listTeams()).rejects.toThrow('Internal server error');
    });
  });

  describe('edge cases', () => {
    it('should handle list with single team', async () => {
      const mockTeams = [
        { id: 1, name: 'Only Team' }
      ];
      mockClient.mockGet('/teams', mockTeams);

      const result = await handler.listTeams();

      expect(result).toHaveLength(1);
    });

    it('should handle list with many teams', async () => {
      const mockTeams = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Team ${i + 1}`
      }));
      mockClient.mockGet('/teams', mockTeams);

      const result = await handler.listTeams();

      expect(result).toHaveLength(50);
    });

    it('should handle team name with special characters', async () => {
      const mockTeam = {
        id: 1,
        name: 'Sales & Marketing Team (North America)'
      };
      mockClient.mockGet('/teams/1', mockTeam);

      const result = await handler.getTeam({ id: 1 });

      expect(result.name).toContain('&');
      expect(result.name).toContain('(North America)');
    });

    it('should handle team name with unicode characters', async () => {
      const mockTeam = {
        id: 1,
        name: 'Equipe de Vendas 销售团队 Команда продаж'
      };
      mockClient.mockGet('/teams/1', mockTeam);

      const result = await handler.getTeam({ id: 1 });

      expect(result.name).toContain('Vendas');
      expect(result.name).toContain('销售');
      expect(result.name).toContain('продаж');
    });

    it('should handle team with very short name', async () => {
      const mockTeam = {
        id: 1,
        name: 'IT'
      };
      mockClient.mockGet('/teams/1', mockTeam);

      const result = await handler.getTeam({ id: 1 });

      expect(result.name).toBe('IT');
    });

    it('should handle team with very long name', async () => {
      const longName = 'A'.repeat(200);
      const mockTeam = {
        id: 1,
        name: longName
      };
      mockClient.mockGet('/teams/1', mockTeam);

      const result = await handler.getTeam({ id: 1 });

      expect(result.name.length).toBe(200);
    });

    it('should handle team name with numbers', async () => {
      const mockTeam = {
        id: 1,
        name: 'Team 2025'
      };
      mockClient.mockGet('/teams/1', mockTeam);

      const result = await handler.getTeam({ id: 1 });

      expect(result.name).toBe('Team 2025');
    });

    it('should handle team name with hyphens and underscores', async () => {
      const mockTeam = {
        id: 1,
        name: 'Sales-EMEA_Q1'
      };
      mockClient.mockGet('/teams/1', mockTeam);

      const result = await handler.getTeam({ id: 1 });

      expect(result.name).toContain('-');
      expect(result.name).toContain('_');
    });
  });

  describe('real-world scenarios', () => {
    it('should handle standard company teams', async () => {
      const mockTeams = [
        { id: 1, name: 'Sales', created_at: '2024-01-01T00:00:00Z' },
        { id: 2, name: 'Marketing', created_at: '2024-01-01T00:00:00Z' },
        { id: 3, name: 'Support', created_at: '2024-01-01T00:00:00Z' },
        { id: 4, name: 'Engineering', created_at: '2024-01-01T00:00:00Z' },
        { id: 5, name: 'Finance', created_at: '2024-01-01T00:00:00Z' },
        { id: 6, name: 'HR', created_at: '2024-01-01T00:00:00Z' }
      ];
      mockClient.mockGet('/teams', mockTeams);

      const result = await handler.listTeams();

      expect(result).toHaveLength(6);
      expect(result.map(t => t.name)).toContain('Sales');
      expect(result.map(t => t.name)).toContain('Engineering');
    });

    it('should handle regional sales teams', async () => {
      const mockTeams = [
        { id: 10, name: 'Sales - North America' },
        { id: 11, name: 'Sales - EMEA' },
        { id: 12, name: 'Sales - APAC' },
        { id: 13, name: 'Sales - LATAM' }
      ];
      mockClient.mockGet('/teams', mockTeams);

      const result = await handler.listTeams({ name: 'Sales' });

      expect(result).toHaveLength(4);
      expect(result.every(team => team.name.startsWith('Sales'))).toBe(true);
    });

    it('should handle specialized teams', async () => {
      const mockTeams = [
        { id: 20, name: 'Enterprise Sales' },
        { id: 21, name: 'SMB Sales' },
        { id: 22, name: 'Inside Sales' },
        { id: 23, name: 'Field Sales' },
        { id: 24, name: 'Account Management' }
      ];
      mockClient.mockGet('/teams', mockTeams);

      const result = await handler.listTeams();

      expect(result).toHaveLength(5);
    });

    it('should handle team with timestamps tracking', async () => {
      const mockTeam = {
        id: 30,
        object: 'team',
        name: 'Customer Success',
        created_at: '2023-01-15T08:00:00Z',
        updated_at: '2025-01-20T14:30:00Z'
      };
      mockClient.mockGet('/teams/30', mockTeam);

      const result = await handler.getTeam({ id: 30 });

      expect(result.created_at).toBe('2023-01-15T08:00:00Z');
      expect(result.updated_at).toBe('2025-01-20T14:30:00Z');
    });

    it('should handle getting specific team details', async () => {
      const mockTeam = {
        id: 5,
        object: 'team',
        name: 'Sales Team East',
        created_at: '2024-06-01T10:00:00Z',
        updated_at: '2024-12-15T16:00:00Z'
      };
      mockClient.mockGet('/teams/5', mockTeam);

      const result = await handler.getTeam({ id: 5 });

      expect(result.id).toBe(5);
      expect(result.name).toBe('Sales Team East');
      expect(result.object).toBe('team');
    });

    it('should handle product-based teams', async () => {
      const mockTeams = [
        { id: 40, name: 'Product Team Alpha' },
        { id: 41, name: 'Product Team Beta' },
        { id: 42, name: 'Product Team Gamma' }
      ];
      mockClient.mockGet('/teams', mockTeams);

      const result = await handler.listTeams({ name: 'Product Team' });

      expect(result).toHaveLength(3);
      expect(result.every(t => t.name.includes('Product Team'))).toBe(true);
    });

    it('should handle cross-functional teams', async () => {
      const mockTeams = [
        { id: 50, name: 'Project Phoenix' },
        { id: 51, name: 'Initiative Q1-2025' },
        { id: 52, name: 'Digital Transformation' }
      ];
      mockClient.mockGet('/teams', mockTeams);

      const result = await handler.listTeams();

      expect(result).toHaveLength(3);
    });

    it('should handle department-based organization', async () => {
      const mockTeams = [
        { id: 1, name: 'Sales Department', created_at: '2024-01-01T00:00:00Z' },
        { id: 2, name: 'Marketing Department', created_at: '2024-01-01T00:00:00Z' },
        { id: 3, name: 'Operations Department', created_at: '2024-01-01T00:00:00Z' },
        { id: 4, name: 'R&D Department', created_at: '2024-01-01T00:00:00Z' }
      ];
      mockClient.mockGet('/teams', mockTeams);

      const result = await handler.listTeams();

      expect(result).toHaveLength(4);
      expect(result.every(t => t.name.includes('Department'))).toBe(true);
    });

    it('should handle hierarchical team names', async () => {
      const mockTeams = [
        { id: 60, name: 'Sales' },
        { id: 61, name: 'Sales > Enterprise' },
        { id: 62, name: 'Sales > SMB' },
        { id: 63, name: 'Sales > Enterprise > West Coast' },
        { id: 64, name: 'Sales > Enterprise > East Coast' }
      ];
      mockClient.mockGet('/teams', mockTeams);

      const result = await handler.listTeams({ name: 'Sales' });

      expect(result).toHaveLength(5);
    });

    it('should preserve exact team order returned by API', async () => {
      const mockTeams = [
        { id: 5, name: 'E Team' },
        { id: 1, name: 'A Team' },
        { id: 3, name: 'C Team' },
        { id: 2, name: 'B Team' }
      ];
      mockClient.mockGet('/teams', mockTeams);

      const result = await handler.listTeams();

      expect(result[0].id).toBe(5);
      expect(result[1].id).toBe(1);
      expect(result[2].id).toBe(3);
      expect(result[3].id).toBe(2);
    });
  });
});