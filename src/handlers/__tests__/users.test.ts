import { UsersHandler } from '../users';
import { MockArivoApiClient } from '../../__tests__/utils/mock-api-client';

describe('UsersHandler', () => {
  let handler: UsersHandler;
  let mockClient: MockArivoApiClient;

  beforeEach(() => {
    mockClient = new MockArivoApiClient() as any;
    handler = new UsersHandler(mockClient as any);
  });

  afterEach(() => {
    mockClient.reset();
  });

  describe('listUsers', () => {
    it('should list users without filters', async () => {
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 1 },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 2 },
        { id: 3, name: 'Bob Manager', email: 'bob@example.com', role: 3 }
      ];
      mockClient.mockGet('/users', mockUsers);

      const result = await handler.listUsers();

      expect(result).toEqual(mockUsers);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('GET');
      expect(lastCall.path).toBe('/users');
    });

    it('should list users with pagination', async () => {
      const mockUsers = [
        { id: 1, name: 'User 1', email: 'user1@example.com' }
      ];
      mockClient.mockGet('/users', mockUsers);

      const result = await handler.listUsers({ limit: 10, offset: 5 });

      expect(result).toEqual(mockUsers);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by name', async () => {
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com' }
      ];
      mockClient.mockGet('/users', mockUsers);

      const result = await handler.listUsers({ name: 'John Doe' });

      expect(result).toEqual(mockUsers);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by email', async () => {
      const mockUsers = [
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
      ];
      mockClient.mockGet('/users', mockUsers);

      const result = await handler.listUsers({ email: 'jane@example.com' });

      expect(result).toEqual(mockUsers);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by role - Admin (1)', async () => {
      const mockUsers = [
        { id: 1, name: 'Admin User', email: 'admin@example.com', role: 1 }
      ];
      mockClient.mockGet('/users', mockUsers);

      const result = await handler.listUsers({ role: 1 });

      expect(result).toEqual(mockUsers);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by role - User (2)', async () => {
      const mockUsers = [
        { id: 2, name: 'Regular User', email: 'user@example.com', role: 2 }
      ];
      mockClient.mockGet('/users', mockUsers);

      const result = await handler.listUsers({ role: 2 });

      expect(result).toEqual(mockUsers);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by role - Team Manager (3)', async () => {
      const mockUsers = [
        { id: 3, name: 'Team Manager', email: 'manager@example.com', role: 3 }
      ];
      mockClient.mockGet('/users', mockUsers);

      const result = await handler.listUsers({ role: 3 });

      expect(result).toEqual(mockUsers);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by team_id', async () => {
      const mockUsers = [
        { id: 1, name: 'Team Member 1', email: 'member1@example.com', team_id: 5 },
        { id: 2, name: 'Team Member 2', email: 'member2@example.com', team_id: 5 }
      ];
      mockClient.mockGet('/users', mockUsers);

      const result = await handler.listUsers({ team_id: 5 });

      expect(result).toEqual(mockUsers);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle sorting options', async () => {
      const mockUsers = [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
        { id: 3, name: 'Charlie', email: 'charlie@example.com' }
      ];
      mockClient.mockGet('/users', mockUsers);

      const result = await handler.listUsers({
        sort_field: 'name',
        sort_order: 'asc'
      });

      expect(result).toEqual(mockUsers);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle multiple filters combined', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 2,
          team_id: 5
        }
      ];
      mockClient.mockGet('/users', mockUsers);

      const result = await handler.listUsers({
        name: 'John Doe',
        email: 'john@example.com',
        role: 2,
        team_id: 5,
        limit: 20
      });

      expect(result).toEqual(mockUsers);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle empty list response', async () => {
      mockClient.mockGet('/users', []);

      const result = await handler.listUsers();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getUser', () => {
    it('should get a user by id', async () => {
      const mockUser = {
        id: 123,
        object: 'user',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 2,
        team_id: 5,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2025-01-20T14:00:00Z'
      };
      mockClient.mockGet('/users/123', mockUser);

      const result = await handler.getUser({ id: 123 });

      expect(result).toEqual(mockUser);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('GET');
      expect(lastCall.path).toBe('/users/123');
    });

    it('should handle user with minimal fields', async () => {
      const mockUser = {
        id: 456,
        name: 'Jane Smith'
      };
      mockClient.mockGet('/users/456', mockUser);

      const result = await handler.getUser({ id: 456 });

      expect(result.id).toBe(456);
      expect(result.name).toBe('Jane Smith');
    });

    it('should handle admin user', async () => {
      const mockUser = {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        role: 1,
        object: 'user'
      };
      mockClient.mockGet('/users/1', mockUser);

      const result = await handler.getUser({ id: 1 });

      expect(result.role).toBe(1);
      expect(result.email).toBe('admin@example.com');
    });

    it('should handle team manager user', async () => {
      const mockUser = {
        id: 10,
        name: 'Team Manager',
        email: 'manager@example.com',
        role: 3,
        team_id: 2
      };
      mockClient.mockGet('/users/10', mockUser);

      const result = await handler.getUser({ id: 10 });

      expect(result.role).toBe(3);
      expect(result.team_id).toBe(2);
    });

    it('should handle user without email', async () => {
      const mockUser = {
        id: 789,
        name: 'No Email User',
        role: 2
      };
      mockClient.mockGet('/users/789', mockUser);

      const result = await handler.getUser({ id: 789 });

      expect(result.name).toBe('No Email User');
      expect(result.email).toBeUndefined();
    });

    it('should throw error if id is missing', async () => {
      await expect(
        handler.getUser({ id: undefined as any })
      ).rejects.toThrow('User ID is required');
    });
  });

  describe('error handling', () => {
    it('should handle errors when listing users', async () => {
      const error = new Error('Network error');
      mockClient.mockError('GET', '/users', error);

      await expect(handler.listUsers()).rejects.toThrow('Network error');
    });

    it('should handle errors when getting a user', async () => {
      const error = new Error('Not found');
      mockClient.mockError('GET', '/users/999', error);

      await expect(handler.getUser({ id: 999 })).rejects.toThrow('Not found');
    });

    it('should handle unauthorized errors', async () => {
      const error = new Error('Unauthorized');
      mockClient.mockError('GET', '/users', error);

      await expect(handler.listUsers()).rejects.toThrow('Unauthorized');
    });

    it('should handle forbidden errors', async () => {
      const error = new Error('Forbidden');
      mockClient.mockError('GET', '/users/123', error);

      await expect(handler.getUser({ id: 123 })).rejects.toThrow('Forbidden');
    });
  });

  describe('edge cases', () => {
    it('should handle list with single user', async () => {
      const mockUsers = [
        { id: 1, name: 'Only User', email: 'only@example.com' }
      ];
      mockClient.mockGet('/users', mockUsers);

      const result = await handler.listUsers();

      expect(result).toHaveLength(1);
    });

    it('should handle list with many users', async () => {
      const mockUsers = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: 2
      }));
      mockClient.mockGet('/users', mockUsers);

      const result = await handler.listUsers();

      expect(result).toHaveLength(100);
    });

    it('should handle user name with special characters', async () => {
      const mockUser = {
        id: 1,
        name: "O'Brien, John (Jr.)",
        email: 'john.obrien@example.com'
      };
      mockClient.mockGet('/users/1', mockUser);

      const result = await handler.getUser({ id: 1 });

      expect(result.name).toContain("O'Brien");
      expect(result.name).toContain('(Jr.)');
    });

    it('should handle user name with unicode characters', async () => {
      const mockUser = {
        id: 1,
        name: 'José García-Müller',
        email: 'jose@example.com'
      };
      mockClient.mockGet('/users/1', mockUser);

      const result = await handler.getUser({ id: 1 });

      expect(result.name).toBe('José García-Müller');
    });

    it('should handle user with long name', async () => {
      const longName = 'A'.repeat(200);
      const mockUser = {
        id: 1,
        name: longName,
        email: 'test@example.com'
      };
      mockClient.mockGet('/users/1', mockUser);

      const result = await handler.getUser({ id: 1 });

      expect(result.name.length).toBe(200);
    });

    it('should handle email with subdomains', async () => {
      const mockUser = {
        id: 1,
        name: 'User',
        email: 'user@subdomain.company.example.com'
      };
      mockClient.mockGet('/users/1', mockUser);

      const result = await handler.getUser({ id: 1 });

      expect(result.email).toBe('user@subdomain.company.example.com');
    });

    it('should handle email with plus addressing', async () => {
      const mockUser = {
        id: 1,
        name: 'User',
        email: 'user+tag@example.com'
      };
      mockClient.mockGet('/users/1', mockUser);

      const result = await handler.getUser({ id: 1 });

      expect(result.email).toContain('+tag');
    });
  });

  describe('real-world scenarios', () => {
    it('should handle listing all admins', async () => {
      const mockUsers = [
        { id: 1, name: 'Admin One', email: 'admin1@example.com', role: 1 },
        { id: 2, name: 'Admin Two', email: 'admin2@example.com', role: 1 }
      ];
      mockClient.mockGet('/users', mockUsers);

      const result = await handler.listUsers({ role: 1 });

      expect(result).toHaveLength(2);
      expect(result.every(user => user.role === 1)).toBe(true);
    });

    it('should handle listing users by team', async () => {
      const mockUsers = [
        { id: 10, name: 'Sales Rep 1', email: 'rep1@example.com', team_id: 3, role: 2 },
        { id: 11, name: 'Sales Rep 2', email: 'rep2@example.com', team_id: 3, role: 2 },
        { id: 12, name: 'Sales Manager', email: 'manager@example.com', team_id: 3, role: 3 }
      ];
      mockClient.mockGet('/users', mockUsers);

      const result = await handler.listUsers({ team_id: 3 });

      expect(result).toHaveLength(3);
      expect(result.every(user => user.team_id === 3)).toBe(true);
    });

    it('should handle organizational hierarchy', async () => {
      const mockUsers = [
        { id: 1, name: 'CEO', email: 'ceo@example.com', role: 1 },
        { id: 2, name: 'Sales Manager', email: 'sales.mgr@example.com', role: 3, team_id: 1 },
        { id: 3, name: 'Sales Rep 1', email: 'rep1@example.com', role: 2, team_id: 1 },
        { id: 4, name: 'Sales Rep 2', email: 'rep2@example.com', role: 2, team_id: 1 },
        { id: 5, name: 'Support Manager', email: 'support.mgr@example.com', role: 3, team_id: 2 },
        { id: 6, name: 'Support Agent', email: 'agent@example.com', role: 2, team_id: 2 }
      ];
      mockClient.mockGet('/users', mockUsers);

      const allUsers = await handler.listUsers();
      expect(allUsers).toHaveLength(6);

      // Get admin
      mockClient.mockGet('/users/1', mockUsers[0]);
      const admin = await handler.getUser({ id: 1 });
      expect(admin.role).toBe(1);

      // Get team managers
      const managers = mockUsers.filter(u => u.role === 3);
      mockClient.mockGet('/users', managers);
      const teamManagers = await handler.listUsers({ role: 3 });
      expect(teamManagers).toHaveLength(2);
    });

    it('should handle user search by partial name', async () => {
      const mockUsers = [
        { id: 1, name: 'John Smith', email: 'john.smith@example.com' },
        { id: 2, name: 'John Doe', email: 'john.doe@example.com' },
        { id: 3, name: 'Johnny Walker', email: 'johnny@example.com' }
      ];
      mockClient.mockGet('/users', mockUsers);

      const result = await handler.listUsers({ name: 'John' });

      expect(result).toHaveLength(3);
      expect(result.every(user => user.name.includes('John'))).toBe(true);
    });

    it('should handle user lookup by email domain', async () => {
      const mockUsers = [
        { id: 1, name: 'User 1', email: 'user1@company.com' },
        { id: 2, name: 'User 2', email: 'user2@company.com' },
        { id: 3, name: 'User 3', email: 'user3@company.com' }
      ];
      mockClient.mockGet('/users', mockUsers);

      const result = await handler.listUsers({ email: 'company.com' });

      expect(result).toHaveLength(3);
    });

    it('should handle getting user details for profile', async () => {
      const mockUser = {
        id: 50,
        object: 'user',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        role: 2,
        team_id: 5,
        created_at: '2024-03-15T08:00:00Z',
        updated_at: '2025-01-20T10:30:00Z'
      };
      mockClient.mockGet('/users/50', mockUser);

      const result = await handler.getUser({ id: 50 });

      expect(result.name).toBe('Sarah Johnson');
      expect(result.email).toBe('sarah.johnson@example.com');
      expect(result.role).toBe(2);
      expect(result.team_id).toBe(5);
      expect(result.created_at).toBeDefined();
    });

    it('should handle role-based access filtering', async () => {
      // Admins
      const admins = [
        { id: 1, name: 'Admin User', email: 'admin@example.com', role: 1 }
      ];
      mockClient.mockGet('/users', admins);
      const adminList = await handler.listUsers({ role: 1 });
      expect(adminList.every(u => u.role === 1)).toBe(true);

      // Team Managers
      const managers = [
        { id: 2, name: 'Manager One', email: 'mgr1@example.com', role: 3 },
        { id: 3, name: 'Manager Two', email: 'mgr2@example.com', role: 3 }
      ];
      mockClient.mockGet('/users', managers);
      const managerList = await handler.listUsers({ role: 3 });
      expect(managerList.every(u => u.role === 3)).toBe(true);

      // Regular Users
      const regularUsers = [
        { id: 10, name: 'User One', email: 'user1@example.com', role: 2 },
        { id: 11, name: 'User Two', email: 'user2@example.com', role: 2 },
        { id: 12, name: 'User Three', email: 'user3@example.com', role: 2 }
      ];
      mockClient.mockGet('/users', regularUsers);
      const userList = await handler.listUsers({ role: 2 });
      expect(userList.every(u => u.role === 2)).toBe(true);
    });

    it('should handle user with timestamps', async () => {
      const mockUser = {
        id: 100,
        name: 'Timestamp User',
        email: 'timestamp@example.com',
        role: 2,
        object: 'user',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2025-01-20T15:45:00Z'
      };
      mockClient.mockGet('/users/100', mockUser);

      const result = await handler.getUser({ id: 100 });

      expect(result.created_at).toBe('2023-01-01T00:00:00Z');
      expect(result.updated_at).toBe('2025-01-20T15:45:00Z');
    });
  });
});