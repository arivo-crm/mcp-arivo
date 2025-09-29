import { PipelinesHandler } from '../pipelines';
import { MockArivoApiClient } from '../../__tests__/utils/mock-api-client';

describe('PipelinesHandler', () => {
  let handler: PipelinesHandler;
  let mockClient: MockArivoApiClient;

  beforeEach(() => {
    mockClient = new MockArivoApiClient() as any;
    handler = new PipelinesHandler(mockClient as any);
  });

  afterEach(() => {
    mockClient.reset();
  });

  describe('listPipelines', () => {
    it('should list pipelines without filters', async () => {
      const mockPipelines = [
        {
          id: 1,
          name: 'Sales Pipeline',
          pipeline_steps: [
            { id: 1, name: 'Lead' },
            { id: 2, name: 'Qualified' },
            { id: 3, name: 'Proposal' },
            { id: 4, name: 'Negotiation' },
            { id: 5, name: 'Closed Won' }
          ]
        },
        {
          id: 2,
          name: 'Support Pipeline',
          pipeline_steps: [
            { id: 6, name: 'New Ticket' },
            { id: 7, name: 'In Progress' },
            { id: 8, name: 'Resolved' }
          ]
        }
      ];
      mockClient.mockGet('/pipelines', mockPipelines);

      const result = await handler.listPipelines();

      expect(result).toEqual(mockPipelines);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('GET');
      expect(lastCall.path).toBe('/pipelines');
    });

    it('should list pipelines with pagination', async () => {
      const mockPipelines = [
        { id: 1, name: 'Pipeline 1', pipeline_steps: [] }
      ];
      mockClient.mockGet('/pipelines', mockPipelines);

      const result = await handler.listPipelines({ limit: 10, offset: 5 });

      expect(result).toEqual(mockPipelines);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle sorting options', async () => {
      const mockPipelines = [
        { id: 1, name: 'A Pipeline', pipeline_steps: [] },
        { id: 2, name: 'B Pipeline', pipeline_steps: [] }
      ];
      mockClient.mockGet('/pipelines', mockPipelines);

      const result = await handler.listPipelines({
        sort_field: 'name',
        sort_order: 'asc'
      });

      expect(result).toEqual(mockPipelines);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle sorting by created_at', async () => {
      const mockPipelines = [
        {
          id: 1,
          name: 'Old Pipeline',
          created_at: '2024-01-01T10:00:00Z',
          pipeline_steps: []
        },
        {
          id: 2,
          name: 'New Pipeline',
          created_at: '2025-01-01T10:00:00Z',
          pipeline_steps: []
        }
      ];
      mockClient.mockGet('/pipelines', mockPipelines);

      const result = await handler.listPipelines({
        sort_field: 'created_at',
        sort_order: 'desc'
      });

      expect(result).toEqual(mockPipelines);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle empty list response', async () => {
      mockClient.mockGet('/pipelines', []);

      const result = await handler.listPipelines();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle pipelines without steps', async () => {
      const mockPipelines = [
        { id: 1, name: 'Empty Pipeline', pipeline_steps: [] },
        { id: 2, name: 'Another Empty Pipeline', pipeline_steps: [] }
      ];
      mockClient.mockGet('/pipelines', mockPipelines);

      const result = await handler.listPipelines();

      expect(result).toHaveLength(2);
      expect(result[0].pipeline_steps).toEqual([]);
    });

    it('should handle pipelines with many steps', async () => {
      const steps = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Step ${i + 1}`
      }));
      const mockPipelines = [
        { id: 1, name: 'Complex Pipeline', pipeline_steps: steps }
      ];
      mockClient.mockGet('/pipelines', mockPipelines);

      const result = await handler.listPipelines();

      expect(result[0].pipeline_steps).toHaveLength(20);
    });
  });

  describe('getPipeline', () => {
    it('should get a pipeline by id', async () => {
      const mockPipeline = {
        id: 123,
        object: 'pipeline',
        name: 'Sales Pipeline',
        created_at: '2025-01-10T10:00:00Z',
        updated_at: '2025-01-15T14:00:00Z',
        pipeline_steps: [
          {
            id: 1,
            object: 'pipeline_step',
            name: 'Lead',
            created_at: '2025-01-10T10:00:00Z'
          },
          {
            id: 2,
            object: 'pipeline_step',
            name: 'Qualified',
            created_at: '2025-01-10T10:00:00Z'
          },
          {
            id: 3,
            object: 'pipeline_step',
            name: 'Proposal',
            created_at: '2025-01-10T10:00:00Z'
          },
          {
            id: 4,
            object: 'pipeline_step',
            name: 'Negotiation',
            created_at: '2025-01-10T10:00:00Z'
          },
          {
            id: 5,
            object: 'pipeline_step',
            name: 'Closed Won',
            created_at: '2025-01-10T10:00:00Z'
          }
        ]
      };
      mockClient.mockGet('/pipelines/123', mockPipeline);

      const result = await handler.getPipeline({ id: 123 });

      expect(result).toEqual(mockPipeline);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('GET');
      expect(lastCall.path).toBe('/pipelines/123');
    });

    it('should handle pipeline with minimal fields', async () => {
      const mockPipeline = {
        id: 456,
        name: 'Simple Pipeline',
        pipeline_steps: []
      };
      mockClient.mockGet('/pipelines/456', mockPipeline);

      const result = await handler.getPipeline({ id: 456 });

      expect(result.id).toBe(456);
      expect(result.name).toBe('Simple Pipeline');
      expect(result.pipeline_steps).toEqual([]);
    });

    it('should handle pipeline with detailed steps', async () => {
      const mockPipeline = {
        id: 789,
        name: 'Detailed Pipeline',
        pipeline_steps: [
          {
            id: 10,
            object: 'pipeline_step',
            name: 'Initial Contact',
            created_at: '2025-01-01T10:00:00Z',
            updated_at: '2025-01-01T10:00:00Z'
          },
          {
            id: 11,
            object: 'pipeline_step',
            name: 'Discovery Call',
            created_at: '2025-01-01T10:00:00Z',
            updated_at: '2025-01-05T14:00:00Z'
          },
          {
            id: 12,
            object: 'pipeline_step',
            name: 'Demo Scheduled',
            created_at: '2025-01-01T10:00:00Z',
            updated_at: '2025-01-10T11:00:00Z'
          }
        ]
      };
      mockClient.mockGet('/pipelines/789', mockPipeline);

      const result = await handler.getPipeline({ id: 789 });

      expect(result.pipeline_steps).toHaveLength(3);
      expect(result.pipeline_steps![0].name).toBe('Initial Contact');
      expect(result.pipeline_steps![0].updated_at).toBeDefined();
    });

    it('should handle pipeline without steps', async () => {
      const mockPipeline = {
        id: 111,
        name: 'New Pipeline',
        pipeline_steps: []
      };
      mockClient.mockGet('/pipelines/111', mockPipeline);

      const result = await handler.getPipeline({ id: 111 });

      expect(result.pipeline_steps).toEqual([]);
    });

    it('should throw error if id is missing', async () => {
      await expect(
        handler.getPipeline({ id: undefined as any })
      ).rejects.toThrow('Pipeline ID is required');
    });
  });

  describe('error handling', () => {
    it('should handle errors when listing pipelines', async () => {
      const error = new Error('Network error');
      mockClient.mockError('GET', '/pipelines', error);

      await expect(handler.listPipelines()).rejects.toThrow('Network error');
    });

    it('should handle errors when getting a pipeline', async () => {
      const error = new Error('Not found');
      mockClient.mockError('GET', '/pipelines/999', error);

      await expect(handler.getPipeline({ id: 999 })).rejects.toThrow('Not found');
    });

    it('should handle unauthorized errors', async () => {
      const error = new Error('Unauthorized');
      mockClient.mockError('GET', '/pipelines', error);

      await expect(handler.listPipelines()).rejects.toThrow('Unauthorized');
    });

    it('should handle server errors', async () => {
      const error = new Error('Internal server error');
      mockClient.mockError('GET', '/pipelines/123', error);

      await expect(handler.getPipeline({ id: 123 })).rejects.toThrow('Internal server error');
    });
  });

  describe('edge cases', () => {
    it('should handle pipeline with single step', async () => {
      const mockPipeline = {
        id: 1,
        name: 'Single Step Pipeline',
        pipeline_steps: [
          { id: 1, name: 'Only Step' }
        ]
      };
      mockClient.mockGet('/pipelines/1', mockPipeline);

      const result = await handler.getPipeline({ id: 1 });

      expect(result.pipeline_steps).toHaveLength(1);
    });

    it('should handle pipeline with many steps', async () => {
      const steps = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Step ${i + 1}`,
        created_at: '2025-01-01T10:00:00Z'
      }));
      const mockPipeline = {
        id: 1,
        name: 'Complex Pipeline',
        pipeline_steps: steps
      };
      mockClient.mockGet('/pipelines/1', mockPipeline);

      const result = await handler.getPipeline({ id: 1 });

      expect(result.pipeline_steps).toHaveLength(50);
      expect(result.pipeline_steps![0].name).toBe('Step 1');
      expect(result.pipeline_steps![49].name).toBe('Step 50');
    });

    it('should handle pipeline name with special characters', async () => {
      const mockPipeline = {
        id: 1,
        name: 'Sales Pipeline (2025) - Q1 & Q2',
        pipeline_steps: []
      };
      mockClient.mockGet('/pipelines/1', mockPipeline);

      const result = await handler.getPipeline({ id: 1 });

      expect(result.name).toBe('Sales Pipeline (2025) - Q1 & Q2');
    });

    it('should handle pipeline name with unicode characters', async () => {
      const mockPipeline = {
        id: 1,
        name: 'Pipeline de Vendas 销售流程 Воронка продаж',
        pipeline_steps: []
      };
      mockClient.mockGet('/pipelines/1', mockPipeline);

      const result = await handler.getPipeline({ id: 1 });

      expect(result.name).toContain('Vendas');
      expect(result.name).toContain('销售');
    });

    it('should handle step name with special characters', async () => {
      const mockPipeline = {
        id: 1,
        name: 'Pipeline',
        pipeline_steps: [
          { id: 1, name: 'Step #1: Initial Contact (High Priority)' },
          { id: 2, name: 'Step #2: Follow-up & Qualification' }
        ]
      };
      mockClient.mockGet('/pipelines/1', mockPipeline);

      const result = await handler.getPipeline({ id: 1 });

      expect(result.pipeline_steps![0].name).toContain('#1:');
      expect(result.pipeline_steps![1].name).toContain('&');
    });

    it('should handle list with single pipeline', async () => {
      const mockPipelines = [
        { id: 1, name: 'Only Pipeline', pipeline_steps: [] }
      ];
      mockClient.mockGet('/pipelines', mockPipelines);

      const result = await handler.listPipelines();

      expect(result).toHaveLength(1);
    });

    it('should handle list with many pipelines', async () => {
      const mockPipelines = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Pipeline ${i + 1}`,
        pipeline_steps: []
      }));
      mockClient.mockGet('/pipelines', mockPipelines);

      const result = await handler.listPipelines();

      expect(result).toHaveLength(20);
    });
  });

  describe('real-world scenarios', () => {
    it('should handle standard sales pipeline', async () => {
      const mockPipeline = {
        id: 1,
        name: 'B2B Sales Pipeline',
        object: 'pipeline',
        created_at: '2024-01-01T00:00:00Z',
        pipeline_steps: [
          { id: 1, name: 'Lead', object: 'pipeline_step' },
          { id: 2, name: 'Contact Made', object: 'pipeline_step' },
          { id: 3, name: 'Qualified', object: 'pipeline_step' },
          { id: 4, name: 'Demo Scheduled', object: 'pipeline_step' },
          { id: 5, name: 'Proposal Sent', object: 'pipeline_step' },
          { id: 6, name: 'Negotiation', object: 'pipeline_step' },
          { id: 7, name: 'Closed Won', object: 'pipeline_step' },
          { id: 8, name: 'Closed Lost', object: 'pipeline_step' }
        ]
      };
      mockClient.mockGet('/pipelines/1', mockPipeline);

      const result = await handler.getPipeline({ id: 1 });

      expect(result.name).toBe('B2B Sales Pipeline');
      expect(result.pipeline_steps).toHaveLength(8);
      expect(result.pipeline_steps![0].name).toBe('Lead');
      expect(result.pipeline_steps![6].name).toBe('Closed Won');
    });

    it('should handle support ticket pipeline', async () => {
      const mockPipeline = {
        id: 2,
        name: 'Customer Support Workflow',
        pipeline_steps: [
          { id: 10, name: 'New Ticket' },
          { id: 11, name: 'Assigned' },
          { id: 12, name: 'In Progress' },
          { id: 13, name: 'Waiting on Customer' },
          { id: 14, name: 'Resolved' },
          { id: 15, name: 'Closed' }
        ]
      };
      mockClient.mockGet('/pipelines/2', mockPipeline);

      const result = await handler.getPipeline({ id: 2 });

      expect(result.name).toBe('Customer Support Workflow');
      expect(result.pipeline_steps).toHaveLength(6);
    });

    it('should handle recruitment pipeline', async () => {
      const mockPipeline = {
        id: 3,
        name: 'Hiring Process',
        pipeline_steps: [
          { id: 20, name: 'Application Received' },
          { id: 21, name: 'Resume Review' },
          { id: 22, name: 'Phone Screen' },
          { id: 23, name: 'Technical Interview' },
          { id: 24, name: 'Team Interview' },
          { id: 25, name: 'Reference Check' },
          { id: 26, name: 'Offer Extended' },
          { id: 27, name: 'Hired' },
          { id: 28, name: 'Rejected' }
        ]
      };
      mockClient.mockGet('/pipelines/3', mockPipeline);

      const result = await handler.getPipeline({ id: 3 });

      expect(result.name).toBe('Hiring Process');
      expect(result.pipeline_steps).toHaveLength(9);
      expect(result.pipeline_steps![3].name).toBe('Technical Interview');
    });

    it('should handle listing all organizational pipelines', async () => {
      const mockPipelines = [
        {
          id: 1,
          name: 'Sales Pipeline',
          pipeline_steps: [
            { id: 1, name: 'Lead' },
            { id: 2, name: 'Qualified' },
            { id: 3, name: 'Closed' }
          ]
        },
        {
          id: 2,
          name: 'Onboarding Pipeline',
          pipeline_steps: [
            { id: 10, name: 'New Customer' },
            { id: 11, name: 'Setup' },
            { id: 12, name: 'Training' },
            { id: 13, name: 'Active' }
          ]
        },
        {
          id: 3,
          name: 'Support Pipeline',
          pipeline_steps: [
            { id: 20, name: 'Open' },
            { id: 21, name: 'In Progress' },
            { id: 22, name: 'Resolved' }
          ]
        }
      ];
      mockClient.mockGet('/pipelines', mockPipelines);

      const result = await handler.listPipelines();

      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('Sales Pipeline');
      expect(result[1].name).toBe('Onboarding Pipeline');
      expect(result[2].name).toBe('Support Pipeline');
    });

    it('should handle pipeline with detailed timestamps', async () => {
      const mockPipeline = {
        id: 1,
        name: 'Tracked Pipeline',
        object: 'pipeline',
        created_at: '2024-06-01T08:00:00Z',
        updated_at: '2025-01-15T14:30:00Z',
        pipeline_steps: [
          {
            id: 1,
            name: 'Step 1',
            object: 'pipeline_step',
            created_at: '2024-06-01T08:00:00Z',
            updated_at: '2024-06-01T08:00:00Z'
          },
          {
            id: 2,
            name: 'Step 2',
            object: 'pipeline_step',
            created_at: '2024-06-01T08:00:00Z',
            updated_at: '2025-01-10T10:00:00Z'
          }
        ]
      };
      mockClient.mockGet('/pipelines/1', mockPipeline);

      const result = await handler.getPipeline({ id: 1 });

      expect(result.created_at).toBe('2024-06-01T08:00:00Z');
      expect(result.updated_at).toBe('2025-01-15T14:30:00Z');
      expect(result.pipeline_steps![1].updated_at).toBe('2025-01-10T10:00:00Z');
    });

    it('should handle simple linear workflow', async () => {
      const mockPipeline = {
        id: 4,
        name: 'Invoice Processing',
        pipeline_steps: [
          { id: 30, name: 'Received' },
          { id: 31, name: 'Approved' },
          { id: 32, name: 'Paid' }
        ]
      };
      mockClient.mockGet('/pipelines/4', mockPipeline);

      const result = await handler.getPipeline({ id: 4 });

      expect(result.pipeline_steps).toHaveLength(3);
      expect(result.pipeline_steps!.map(s => s.name)).toEqual(['Received', 'Approved', 'Paid']);
    });
  });
});