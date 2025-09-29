import { TaskTypesHandler } from '../task-types';
import { MockArivoApiClient } from '../../__tests__/utils/mock-api-client';

describe('TaskTypesHandler', () => {
  let handler: TaskTypesHandler;
  let mockClient: MockArivoApiClient;

  beforeEach(() => {
    mockClient = new MockArivoApiClient() as any;
    handler = new TaskTypesHandler(mockClient as any);
  });

  afterEach(() => {
    mockClient.reset();
  });

  describe('listTaskTypes', () => {
    it('should list all task types', async () => {
      const mockTaskTypes = [
        { id: 1, label: 'Call' },
        { id: 2, label: 'Email' },
        { id: 3, label: 'Meeting' },
        { id: 4, label: 'Follow-up' },
        { id: 5, label: 'Task' }
      ];
      mockClient.mockGet('/task_types', mockTaskTypes);

      const result = await handler.listTaskTypes();

      expect(result).toEqual(mockTaskTypes);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('GET');
      expect(lastCall.path).toBe('/task_types');
    });

    it('should handle empty list response', async () => {
      mockClient.mockGet('/task_types', []);

      const result = await handler.listTaskTypes();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle single task type', async () => {
      const mockTaskTypes = [
        { id: 1, label: 'Call' }
      ];
      mockClient.mockGet('/task_types', mockTaskTypes);

      const result = await handler.listTaskTypes();

      expect(result).toHaveLength(1);
      expect(result[0].label).toBe('Call');
    });

    it('should handle task types with numeric ids', async () => {
      const mockTaskTypes = [
        { id: 1, label: 'Type 1' },
        { id: 100, label: 'Type 100' },
        { id: 999, label: 'Type 999' }
      ];
      mockClient.mockGet('/task_types', mockTaskTypes);

      const result = await handler.listTaskTypes();

      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(100);
      expect(result[2].id).toBe(999);
    });

    it('should handle task types with special characters in label', async () => {
      const mockTaskTypes = [
        { id: 1, label: 'Follow-up Call' },
        { id: 2, label: 'Client Meeting (On-site)' },
        { id: 3, label: 'Email & Documentation' }
      ];
      mockClient.mockGet('/task_types', mockTaskTypes);

      const result = await handler.listTaskTypes();

      expect(result[0].label).toBe('Follow-up Call');
      expect(result[1].label).toContain('(On-site)');
      expect(result[2].label).toContain('&');
    });

    it('should handle task types with unicode characters', async () => {
      const mockTaskTypes = [
        { id: 1, label: 'Ligação' },
        { id: 2, label: 'Reunião' },
        { id: 3, label: '电话' },
        { id: 4, label: 'Звонок' }
      ];
      mockClient.mockGet('/task_types', mockTaskTypes);

      const result = await handler.listTaskTypes();

      expect(result[0].label).toBe('Ligação');
      expect(result[1].label).toBe('Reunião');
      expect(result[2].label).toBe('电话');
      expect(result[3].label).toBe('Звонок');
    });

    it('should handle many task types', async () => {
      const mockTaskTypes = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        label: `Task Type ${i + 1}`
      }));
      mockClient.mockGet('/task_types', mockTaskTypes);

      const result = await handler.listTaskTypes();

      expect(result).toHaveLength(50);
      expect(result[0].label).toBe('Task Type 1');
      expect(result[49].label).toBe('Task Type 50');
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      const error = new Error('Network error');
      mockClient.mockError('GET', '/task_types', error);

      await expect(handler.listTaskTypes()).rejects.toThrow('Network error');
    });

    it('should handle unauthorized errors', async () => {
      const error = new Error('Unauthorized');
      mockClient.mockError('GET', '/task_types', error);

      await expect(handler.listTaskTypes()).rejects.toThrow('Unauthorized');
    });

    it('should handle server errors', async () => {
      const error = new Error('Internal server error');
      mockClient.mockError('GET', '/task_types', error);

      await expect(handler.listTaskTypes()).rejects.toThrow('Internal server error');
    });

    it('should handle not found errors', async () => {
      const error = new Error('Not found');
      mockClient.mockError('GET', '/task_types', error);

      await expect(handler.listTaskTypes()).rejects.toThrow('Not found');
    });
  });

  describe('real-world scenarios', () => {
    it('should handle standard CRM task types', async () => {
      const mockTaskTypes = [
        { id: 1, label: 'Call' },
        { id: 2, label: 'Email' },
        { id: 3, label: 'Meeting' },
        { id: 4, label: 'Task' },
        { id: 5, label: 'Deadline' },
        { id: 6, label: 'Follow-up' },
        { id: 7, label: 'Demo' },
        { id: 8, label: 'Proposal' }
      ];
      mockClient.mockGet('/task_types', mockTaskTypes);

      const result = await handler.listTaskTypes();

      expect(result).toHaveLength(8);
      expect(result.map(t => t.label)).toContain('Call');
      expect(result.map(t => t.label)).toContain('Email');
      expect(result.map(t => t.label)).toContain('Meeting');
    });

    it('should handle sales-specific task types', async () => {
      const mockTaskTypes = [
        { id: 10, label: 'Cold Call' },
        { id: 11, label: 'Discovery Call' },
        { id: 12, label: 'Product Demo' },
        { id: 13, label: 'Send Proposal' },
        { id: 14, label: 'Negotiation Meeting' },
        { id: 15, label: 'Contract Review' },
        { id: 16, label: 'Closing Call' }
      ];
      mockClient.mockGet('/task_types', mockTaskTypes);

      const result = await handler.listTaskTypes();

      expect(result).toHaveLength(7);
      expect(result.find(t => t.label === 'Discovery Call')).toBeDefined();
      expect(result.find(t => t.label === 'Product Demo')).toBeDefined();
    });

    it('should handle support task types', async () => {
      const mockTaskTypes = [
        { id: 20, label: 'Customer Call' },
        { id: 21, label: 'Technical Support' },
        { id: 22, label: 'Bug Investigation' },
        { id: 23, label: 'Feature Request' },
        { id: 24, label: 'Customer Training' },
        { id: 25, label: 'Issue Resolution' }
      ];
      mockClient.mockGet('/task_types', mockTaskTypes);

      const result = await handler.listTaskTypes();

      expect(result).toHaveLength(6);
      expect(result.find(t => t.label === 'Technical Support')).toBeDefined();
      expect(result.find(t => t.label === 'Bug Investigation')).toBeDefined();
    });

    it('should handle custom business task types', async () => {
      const mockTaskTypes = [
        { id: 30, label: 'Site Visit' },
        { id: 31, label: 'Documentation Review' },
        { id: 32, label: 'Compliance Check' },
        { id: 33, label: 'Quality Audit' },
        { id: 34, label: 'Supplier Meeting' }
      ];
      mockClient.mockGet('/task_types', mockTaskTypes);

      const result = await handler.listTaskTypes();

      expect(result).toHaveLength(5);
      expect(result.map(t => t.label)).toContain('Site Visit');
      expect(result.map(t => t.label)).toContain('Compliance Check');
    });

    it('should handle multilingual task types', async () => {
      const mockTaskTypes = [
        { id: 1, label: 'Call / Ligação / 电话' },
        { id: 2, label: 'Email / E-mail / 电子邮件' },
        { id: 3, label: 'Meeting / Reunião / 会议' }
      ];
      mockClient.mockGet('/task_types', mockTaskTypes);

      const result = await handler.listTaskTypes();

      expect(result).toHaveLength(3);
      expect(result[0].label).toContain('/');
      expect(result[0].label).toContain('电话');
    });

    it('should handle task types with long labels', async () => {
      const mockTaskTypes = [
        { id: 1, label: 'Comprehensive quarterly business review meeting with stakeholders' },
        { id: 2, label: 'Technical implementation planning and architecture discussion session' }
      ];
      mockClient.mockGet('/task_types', mockTaskTypes);

      const result = await handler.listTaskTypes();

      expect(result[0].label.length).toBeGreaterThan(50);
      expect(result[1].label).toContain('architecture');
    });

    it('should handle task types with abbreviations', async () => {
      const mockTaskTypes = [
        { id: 1, label: 'Q&A Session' },
        { id: 2, label: 'R&D Discussion' },
        { id: 3, label: 'P&L Review' },
        { id: 4, label: 'ROI Analysis' },
        { id: 5, label: 'KPI Review' }
      ];
      mockClient.mockGet('/task_types', mockTaskTypes);

      const result = await handler.listTaskTypes();

      expect(result).toHaveLength(5);
      expect(result.map(t => t.label)).toContain('Q&A Session');
      expect(result.map(t => t.label)).toContain('ROI Analysis');
    });

    it('should preserve exact order returned by API', async () => {
      const mockTaskTypes = [
        { id: 5, label: 'Email' },
        { id: 1, label: 'Call' },
        { id: 3, label: 'Meeting' },
        { id: 2, label: 'Task' }
      ];
      mockClient.mockGet('/task_types', mockTaskTypes);

      const result = await handler.listTaskTypes();

      expect(result[0].id).toBe(5);
      expect(result[1].id).toBe(1);
      expect(result[2].id).toBe(3);
      expect(result[3].id).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('should handle task type with very short label', async () => {
      const mockTaskTypes = [
        { id: 1, label: 'A' },
        { id: 2, label: 'B' }
      ];
      mockClient.mockGet('/task_types', mockTaskTypes);

      const result = await handler.listTaskTypes();

      expect(result[0].label).toBe('A');
      expect(result[1].label).toBe('B');
    });

    it('should handle task type with numbers in label', async () => {
      const mockTaskTypes = [
        { id: 1, label: 'Follow-up Day 1' },
        { id: 2, label: 'Follow-up Day 7' },
        { id: 3, label: 'Follow-up Day 30' }
      ];
      mockClient.mockGet('/task_types', mockTaskTypes);

      const result = await handler.listTaskTypes();

      expect(result[0].label).toContain('Day 1');
      expect(result[2].label).toContain('Day 30');
    });

    it('should handle task type with emoji', async () => {
      const mockTaskTypes = [
        { id: 1, label: '📞 Call' },
        { id: 2, label: '📧 Email' },
        { id: 3, label: '🤝 Meeting' }
      ];
      mockClient.mockGet('/task_types', mockTaskTypes);

      const result = await handler.listTaskTypes();

      expect(result[0].label).toContain('📞');
      expect(result[1].label).toContain('📧');
      expect(result[2].label).toContain('🤝');
    });

    it('should handle duplicate labels with different ids', async () => {
      const mockTaskTypes = [
        { id: 1, label: 'Call' },
        { id: 2, label: 'Call' },
        { id: 3, label: 'Meeting' }
      ];
      mockClient.mockGet('/task_types', mockTaskTypes);

      const result = await handler.listTaskTypes();

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
      expect(result[0].label).toBe(result[1].label);
    });

    it('should handle task type with whitespace', async () => {
      const mockTaskTypes = [
        { id: 1, label: '  Call  ' },
        { id: 2, label: 'Email\t' },
        { id: 3, label: '\nMeeting' }
      ];
      mockClient.mockGet('/task_types', mockTaskTypes);

      const result = await handler.listTaskTypes();

      expect(result[0].label).toBe('  Call  ');
      expect(result[1].label).toContain('\t');
    });

    it('should handle large id numbers', async () => {
      const mockTaskTypes = [
        { id: 999999, label: 'Large ID Task' },
        { id: 1000000, label: 'Million ID Task' }
      ];
      mockClient.mockGet('/task_types', mockTaskTypes);

      const result = await handler.listTaskTypes();

      expect(result[0].id).toBe(999999);
      expect(result[1].id).toBe(1000000);
    });
  });
});