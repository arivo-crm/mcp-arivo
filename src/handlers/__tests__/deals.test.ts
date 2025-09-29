import { DealsHandler } from '../deals';
import { MockArivoApiClient } from '../../__tests__/utils/mock-api-client';

describe('DealsHandler', () => {
  let handler: DealsHandler;
  let mockClient: MockArivoApiClient;

  beforeEach(() => {
    mockClient = new MockArivoApiClient() as any;
    handler = new DealsHandler(mockClient as any);
  });

  afterEach(() => {
    mockClient.reset();
  });

  describe('listDeals', () => {
    it('should list deals without filters', async () => {
      const mockDeals = [
        { id: 1, name: 'Deal 1', status: 'open', value: 10000 },
        { id: 2, name: 'Deal 2', status: 'won', value: 25000 }
      ];
      mockClient.mockGet('/deals', mockDeals);

      const result = await handler.listDeals();

      expect(result).toEqual(mockDeals);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('GET');
      expect(lastCall.path).toBe('/deals');
    });

    it('should list deals with pagination', async () => {
      const mockDeals = [{ id: 1, name: 'Deal 1' }];
      mockClient.mockGet('/deals', mockDeals);

      const result = await handler.listDeals({ limit: 10, offset: 5 });

      expect(result).toEqual(mockDeals);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by status', async () => {
      const mockDeals = [{ id: 1, name: 'Won Deal', status: 'won' }];
      mockClient.mockGet('/deals', mockDeals);

      const result = await handler.listDeals({ status: 'won' });

      expect(result).toEqual(mockDeals);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by temperature', async () => {
      const mockDeals = [{ id: 1, name: 'Hot Deal', temperature: 'hot' }];
      mockClient.mockGet('/deals', mockDeals);

      const result = await handler.listDeals({ temperature: 'hot' });

      expect(result).toEqual(mockDeals);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by pipeline_id and pipeline_step_id', async () => {
      const mockDeals = [
        {
          id: 1,
          name: 'Pipeline Deal',
          pipeline_id: 5,
          pipeline_step_id: 12
        }
      ];
      mockClient.mockGet('/deals', mockDeals);

      const result = await handler.listDeals({
        pipeline_id: 5,
        pipeline_step_id: 12
      });

      expect(result).toEqual(mockDeals);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by name', async () => {
      const mockDeals = [{ id: 1, name: 'Specific Deal' }];
      mockClient.mockGet('/deals', mockDeals);

      const result = await handler.listDeals({ name: 'Specific Deal' });

      expect(result).toEqual(mockDeals);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by company_id and contact_id', async () => {
      const mockDeals = [
        {
          id: 1,
          name: 'Associated Deal',
          company_id: 100,
          contact_id: 200
        }
      ];
      mockClient.mockGet('/deals', mockDeals);

      const result = await handler.listDeals({
        company_id: 100,
        contact_id: 200
      });

      expect(result).toEqual(mockDeals);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by tags', async () => {
      const mockDeals = [
        { id: 1, name: 'Tagged Deal', tags: ['enterprise', 'priority'] }
      ];
      mockClient.mockGet('/deals', mockDeals);

      const result = await handler.listDeals({ tags: 'enterprise,priority' });

      expect(result).toEqual(mockDeals);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by user_id and team_id', async () => {
      const mockDeals = [
        { id: 1, name: 'Assigned Deal', user_id: 10, team_id: 5 }
      ];
      mockClient.mockGet('/deals', mockDeals);

      const result = await handler.listDeals({ user_id: 10, team_id: 5 });

      expect(result).toEqual(mockDeals);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle search parameter', async () => {
      const mockDeals = [{ id: 1, name: 'Searchable Deal' }];
      mockClient.mockGet('/deals', mockDeals);

      const result = await handler.listDeals({ search: 'Searchable' });

      expect(result).toEqual(mockDeals);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle deprecated stage parameter', async () => {
      const mockDeals = [{ id: 1, name: 'Stage Deal' }];
      mockClient.mockGet('/deals', mockDeals);

      const result = await handler.listDeals({ stage: 'negotiation' });

      expect(result).toEqual(mockDeals);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle sorting options', async () => {
      const mockDeals = [
        { id: 1, name: 'Deal A', value: 5000 },
        { id: 2, name: 'Deal B', value: 15000 }
      ];
      mockClient.mockGet('/deals', mockDeals);

      const result = await handler.listDeals({
        sort_field: 'value',
        sort_order: 'desc'
      });

      expect(result).toEqual(mockDeals);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle multiple filters combined', async () => {
      const mockDeals = [
        {
          id: 1,
          name: 'Complex Deal',
          status: 'open',
          temperature: 'hot',
          pipeline_id: 3,
          user_id: 7,
          tags: ['enterprise']
        }
      ];
      mockClient.mockGet('/deals', mockDeals);

      const result = await handler.listDeals({
        status: 'open',
        temperature: 'hot',
        pipeline_id: 3,
        user_id: 7,
        tags: 'enterprise',
        limit: 20
      });

      expect(result).toEqual(mockDeals);
      expect(mockClient.getLastCall().method).toBe('GET');
    });
  });

  describe('getDeal', () => {
    it('should get a deal by id', async () => {
      const mockDeal = {
        id: 123,
        object: 'deal',
        name: 'Enterprise Deal',
        description: 'Large enterprise contract',
        value: 150000,
        status: 'open',
        temperature: 'hot',
        company_id: 50,
        contact_id: 75,
        pipeline_id: 2,
        pipeline_step_id: 8,
        created_at: '2025-01-15T10:00:00Z',
        user_id: 1,
        team_id: 1
      };
      mockClient.mockGet('/deals/123', mockDeal);

      const result = await handler.getDeal({ id: 123 });

      expect(result).toEqual(mockDeal);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('GET');
      expect(lastCall.path).toBe('/deals/123');
    });

    it('should handle deal with quote items', async () => {
      const mockDeal = {
        id: 456,
        name: 'Deal with Products',
        value: 75000,
        quote_items: [
          {
            id: 1,
            name: 'Product A',
            product_id: 10,
            price: 25000,
            quantity: 2,
            discount: 10,
            total_price: 45000
          },
          {
            id: 2,
            name: 'Product B',
            product_id: 11,
            price: 15000,
            quantity: 1,
            discount: 0,
            total_price: 15000
          }
        ]
      };
      mockClient.mockGet('/deals/456', mockDeal);

      const result = await handler.getDeal({ id: 456 });

      expect(result.quote_items).toHaveLength(2);
      expect(result.quote_items![0].name).toBe('Product A');
      expect(result.quote_items![0].total_price).toBe(45000);
    });

    it('should handle deal with custom fields', async () => {
      const mockDeal = {
        id: 789,
        name: 'Custom Deal',
        custom_fields: {
          custom_lead_source: 'Referral',
          custom_priority: 'High',
          custom_notes: 'Important client'
        }
      };
      mockClient.mockGet('/deals/789', mockDeal);

      const result = await handler.getDeal({ id: 789 });

      expect(result.custom_fields).toBeDefined();
      expect(result.custom_fields!.custom_lead_source).toBe('Referral');
      expect(result.custom_fields!.custom_priority).toBe('High');
    });

    it('should handle deal with tags', async () => {
      const mockDeal = {
        id: 101,
        name: 'Tagged Deal',
        tags: ['vip', 'enterprise', 'hot-lead']
      };
      mockClient.mockGet('/deals/101', mockDeal);

      const result = await handler.getDeal({ id: 101 });

      expect(result.tags).toHaveLength(3);
      expect(result.tags).toContain('enterprise');
    });

    it('should throw error if id is missing', async () => {
      await expect(
        handler.getDeal({ id: undefined as any })
      ).rejects.toThrow('Deal ID is required');
    });
  });

  describe('createDeal', () => {
    it('should create a deal with basic info', async () => {
      const newDeal = {
        name: 'New Deal',
        value: 50000,
        status: 'open'
      };
      const createdDeal = {
        id: 123,
        ...newDeal,
        created_at: '2025-01-20T14:30:00Z'
      };
      mockClient.mockPost('/deals', createdDeal);

      const result = await handler.createDeal({ deal: newDeal });

      expect(result).toEqual(createdDeal);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('POST');
      expect(lastCall.path).toBe('/deals');
      expect(lastCall.data).toEqual(newDeal);
    });

    it('should create deal with company and contact associations', async () => {
      const newDeal = {
        name: 'Associated Deal',
        company_id: 100,
        contact_id: 200,
        value: 30000
      };
      const createdDeal = { id: 456, ...newDeal };
      mockClient.mockPost('/deals', createdDeal);

      const result = await handler.createDeal({ deal: newDeal });

      expect(result.company_id).toBe(100);
      expect(result.contact_id).toBe(200);
      expect(mockClient.getLastCall().data).toEqual(newDeal);
    });

    it('should create deal with pipeline information', async () => {
      const newDeal = {
        name: 'Pipeline Deal',
        pipeline_id: 5,
        pipeline_step_id: 12,
        value: 40000
      };
      const createdDeal = { id: 789, ...newDeal };
      mockClient.mockPost('/deals', createdDeal);

      const result = await handler.createDeal({ deal: newDeal });

      expect(result.pipeline_id).toBe(5);
      expect(result.pipeline_step_id).toBe(12);
    });

    it('should create deal with temperature and status', async () => {
      const newDeal = {
        name: 'Hot Deal',
        temperature: 'hot',
        status: 'open',
        value: 100000
      };
      const createdDeal = { id: 111, ...newDeal };
      mockClient.mockPost('/deals', createdDeal);

      const result = await handler.createDeal({ deal: newDeal });

      expect(result.temperature).toBe('hot');
      expect(result.status).toBe('open');
    });

    it('should create deal with quote items', async () => {
      const newDeal = {
        name: 'Deal with Products',
        value: 60000,
        quote_items: [
          {
            name: 'Service A',
            product_id: 10,
            price: 20000,
            quantity: 2,
            discount: 5
          },
          {
            name: 'Service B',
            product_id: 11,
            price: 10000,
            quantity: 1,
            discount: 0
          }
        ]
      };
      const createdDeal = { id: 222, ...newDeal };
      mockClient.mockPost('/deals', createdDeal);

      const result = await handler.createDeal({ deal: newDeal });

      expect(result.quote_items).toHaveLength(2);
      expect(mockClient.getLastCall().data.quote_items).toEqual(newDeal.quote_items);
    });

    it('should create deal with tags', async () => {
      const newDeal = {
        name: 'Tagged Deal',
        value: 25000,
        tags: ['enterprise', 'q1-2025', 'high-priority']
      };
      const createdDeal = { id: 333, ...newDeal };
      mockClient.mockPost('/deals', createdDeal);

      const result = await handler.createDeal({ deal: newDeal });

      expect(result.tags).toEqual(['enterprise', 'q1-2025', 'high-priority']);
      expect(mockClient.getLastCall().data.tags).toEqual(newDeal.tags);
    });

    it('should create deal with custom fields', async () => {
      const newDeal = {
        name: 'Custom Deal',
        value: 35000,
        custom_fields: {
          custom_source: 'Webinar',
          custom_priority: 'High',
          custom_probability: 75
        }
      };
      const createdDeal = { id: 444, ...newDeal };
      mockClient.mockPost('/deals', createdDeal);

      const result = await handler.createDeal({ deal: newDeal });

      expect(result.custom_fields).toBeDefined();
      expect(mockClient.getLastCall().data.custom_fields).toEqual(newDeal.custom_fields);
    });

    it('should create deal with user and team assignment', async () => {
      const newDeal = {
        name: 'Assigned Deal',
        value: 45000,
        user_id: 10,
        team_id: 5
      };
      const createdDeal = { id: 555, ...newDeal };
      mockClient.mockPost('/deals', createdDeal);

      const result = await handler.createDeal({ deal: newDeal });

      expect(result.user_id).toBe(10);
      expect(result.team_id).toBe(5);
    });

    it('should create deal with estimated close date', async () => {
      const newDeal = {
        name: 'Scheduled Deal',
        value: 55000,
        estimated_close_date: '2025-03-15'
      };
      const createdDeal = { id: 666, ...newDeal };
      mockClient.mockPost('/deals', createdDeal);

      const result = await handler.createDeal({ deal: newDeal });

      expect(result.estimated_close_date).toBe('2025-03-15');
    });

    it('should throw error if name is missing', async () => {
      await expect(
        handler.createDeal({ deal: { value: 10000 } as any })
      ).rejects.toThrow('Deal name is required');
    });

    it('should throw error if deal object is missing', async () => {
      await expect(
        handler.createDeal({ deal: undefined as any })
      ).rejects.toThrow('Deal name is required');
    });
  });

  describe('updateDeal', () => {
    it('should update a deal', async () => {
      const updateData = { name: 'Updated Deal Name' };
      const updatedDeal = {
        id: 123,
        name: 'Updated Deal Name',
        value: 50000
      };
      mockClient.mockPut('/deals/123', updatedDeal);

      const result = await handler.updateDeal({ id: 123, deal: updateData });

      expect(result).toEqual(updatedDeal);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('PUT');
      expect(lastCall.path).toBe('/deals/123');
      expect(lastCall.data).toEqual(updateData);
    });

    it('should update deal status', async () => {
      const updateData = { status: 'won', closed_at: '2025-01-20T15:00:00Z' };
      const updatedDeal = { id: 123, name: 'Deal', ...updateData };
      mockClient.mockPut('/deals/123', updatedDeal);

      const result = await handler.updateDeal({ id: 123, deal: updateData });

      expect(result.status).toBe('won');
      expect(result.closed_at).toBe('2025-01-20T15:00:00Z');
    });

    it('should update deal value and temperature', async () => {
      const updateData = { value: 100000, temperature: 'hot' };
      const updatedDeal = { id: 456, name: 'Deal', ...updateData };
      mockClient.mockPut('/deals/456', updatedDeal);

      const result = await handler.updateDeal({ id: 456, deal: updateData });

      expect(result.value).toBe(100000);
      expect(result.temperature).toBe('hot');
    });

    it('should update pipeline information', async () => {
      const updateData = { pipeline_id: 3, pipeline_step_id: 9 };
      const updatedDeal = { id: 789, name: 'Deal', ...updateData };
      mockClient.mockPut('/deals/789', updatedDeal);

      const result = await handler.updateDeal({ id: 789, deal: updateData });

      expect(result.pipeline_id).toBe(3);
      expect(result.pipeline_step_id).toBe(9);
    });

    it('should update quote items', async () => {
      const updateData = {
        quote_items: [
          {
            id: 1,
            name: 'Updated Product',
            price: 30000,
            quantity: 1,
            discount: 10
          }
        ]
      };
      const updatedDeal = { id: 111, name: 'Deal', ...updateData };
      mockClient.mockPut('/deals/111', updatedDeal);

      const result = await handler.updateDeal({ id: 111, deal: updateData });

      expect(result.quote_items).toHaveLength(1);
      expect(result.quote_items![0].name).toBe('Updated Product');
    });

    it('should update tags', async () => {
      const updateData = { tags: ['updated', 'new-tag'] };
      const updatedDeal = { id: 222, name: 'Deal', ...updateData };
      mockClient.mockPut('/deals/222', updatedDeal);

      const result = await handler.updateDeal({ id: 222, deal: updateData });

      expect(result.tags).toEqual(['updated', 'new-tag']);
    });

    it('should update custom fields', async () => {
      const updateData = {
        custom_fields: {
          custom_priority: 'Critical',
          custom_notes: 'Updated notes'
        }
      };
      const updatedDeal = { id: 333, name: 'Deal', ...updateData };
      mockClient.mockPut('/deals/333', updatedDeal);

      const result = await handler.updateDeal({ id: 333, deal: updateData });

      expect(result.custom_fields!.custom_priority).toBe('Critical');
    });

    it('should update user and team assignment', async () => {
      const updateData = { user_id: 20, team_id: 10 };
      const updatedDeal = { id: 444, name: 'Deal', ...updateData };
      mockClient.mockPut('/deals/444', updatedDeal);

      const result = await handler.updateDeal({ id: 444, deal: updateData });

      expect(result.user_id).toBe(20);
      expect(result.team_id).toBe(10);
    });

    it('should throw error if id is missing', async () => {
      await expect(
        handler.updateDeal({ id: undefined as any, deal: { name: 'Test' } })
      ).rejects.toThrow('Deal ID is required');
    });

    it('should throw error if deal data is missing', async () => {
      await expect(
        handler.updateDeal({ id: 123, deal: undefined as any })
      ).rejects.toThrow('Deal data is required');
    });
  });

  describe('deleteDeal', () => {
    it('should delete a deal', async () => {
      mockClient.mockDelete('/deals/123', undefined);

      const result = await handler.deleteDeal({ id: 123 });

      expect(result).toEqual({ success: true });
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('DELETE');
      expect(lastCall.path).toBe('/deals/123');
    });

    it('should handle deleting multiple deals sequentially', async () => {
      mockClient.mockDelete('/deals/1', undefined);
      mockClient.mockDelete('/deals/2', undefined);
      mockClient.mockDelete('/deals/3', undefined);

      await handler.deleteDeal({ id: 1 });
      await handler.deleteDeal({ id: 2 });
      await handler.deleteDeal({ id: 3 });

      const history = mockClient.getCallHistory();
      expect(history).toHaveLength(3);
      expect(history[0].path).toBe('/deals/1');
      expect(history[1].path).toBe('/deals/2');
      expect(history[2].path).toBe('/deals/3');
    });

    it('should throw error if id is missing', async () => {
      await expect(
        handler.deleteDeal({ id: undefined as any })
      ).rejects.toThrow('Deal ID is required');
    });
  });

  describe('error handling', () => {
    it('should handle errors when listing deals', async () => {
      const error = new Error('Network error');
      mockClient.mockError('GET', '/deals', error);

      await expect(handler.listDeals()).rejects.toThrow('Network error');
    });

    it('should handle errors when getting a deal', async () => {
      const error = new Error('Not found');
      mockClient.mockError('GET', '/deals/999', error);

      await expect(handler.getDeal({ id: 999 })).rejects.toThrow('Not found');
    });

    it('should handle errors when creating a deal', async () => {
      const error = new Error('Validation error');
      mockClient.mockError('POST', '/deals', error);

      await expect(
        handler.createDeal({ deal: { name: 'Test Deal' } })
      ).rejects.toThrow('Validation error');
    });

    it('should handle errors when updating a deal', async () => {
      const error = new Error('Unauthorized');
      mockClient.mockError('PUT', '/deals/123', error);

      await expect(
        handler.updateDeal({ id: 123, deal: { name: 'Updated' } })
      ).rejects.toThrow('Unauthorized');
    });

    it('should handle errors when deleting a deal', async () => {
      const error = new Error('Forbidden');
      mockClient.mockError('DELETE', '/deals/123', error);

      await expect(handler.deleteDeal({ id: 123 })).rejects.toThrow('Forbidden');
    });
  });

  describe('edge cases', () => {
    it('should handle empty list response', async () => {
      mockClient.mockGet('/deals', []);

      const result = await handler.listDeals();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle deal with minimal fields', async () => {
      const mockDeal = { id: 1, name: 'Minimal Deal' };
      mockClient.mockGet('/deals/1', mockDeal);

      const result = await handler.getDeal({ id: 1 });

      expect(result.id).toBe(1);
      expect(result.name).toBe('Minimal Deal');
    });

    it('should handle deal with very large value', async () => {
      const mockDeal = {
        id: 1,
        name: 'Enterprise Deal',
        value: 10000000
      };
      mockClient.mockGet('/deals/1', mockDeal);

      const result = await handler.getDeal({ id: 1 });

      expect(result.value).toBe(10000000);
    });

    it('should handle deal with many quote items', async () => {
      const quoteItems = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Product ${i + 1}`,
        price: 1000,
        quantity: 1
      }));
      const mockDeal = {
        id: 1,
        name: 'Complex Deal',
        quote_items: quoteItems
      };
      mockClient.mockGet('/deals/1', mockDeal);

      const result = await handler.getDeal({ id: 1 });

      expect(result.quote_items).toHaveLength(50);
    });

    it('should handle deal with many tags', async () => {
      const tags = Array.from({ length: 20 }, (_, i) => `tag-${i + 1}`);
      const mockDeal = {
        id: 1,
        name: 'Tagged Deal',
        tags: tags
      };
      mockClient.mockGet('/deals/1', mockDeal);

      const result = await handler.getDeal({ id: 1 });

      expect(result.tags).toHaveLength(20);
    });

    it('should handle deal name with special characters', async () => {
      const mockDeal = {
        id: 1,
        name: 'Deal #1 (2025) - "Special" & Important'
      };
      mockClient.mockGet('/deals/1', mockDeal);

      const result = await handler.getDeal({ id: 1 });

      expect(result.name).toBe('Deal #1 (2025) - "Special" & Important');
    });

    it('should handle deal with unicode characters', async () => {
      const mockDeal = {
        id: 1,
        name: 'Negócio Internacional 国际交易 сделка'
      };
      mockClient.mockGet('/deals/1', mockDeal);

      const result = await handler.getDeal({ id: 1 });

      expect(result.name).toBe('Negócio Internacional 国际交易 сделка');
    });
  });

  describe('real-world scenarios', () => {
    it('should handle complete deal lifecycle', async () => {
      // Create deal
      const newDeal = {
        name: 'New Enterprise Deal',
        value: 150000,
        status: 'open',
        temperature: 'warm',
        company_id: 100,
        contact_id: 200,
        pipeline_id: 1,
        pipeline_step_id: 2
      };
      const createdDeal = { id: 1, ...newDeal };
      mockClient.mockPost('/deals', createdDeal);

      const created = await handler.createDeal({ deal: newDeal });
      expect(created.id).toBe(1);

      // Update deal to hot
      const updateHot = { temperature: 'hot', pipeline_step_id: 4 };
      const updatedHot = { ...createdDeal, ...updateHot };
      mockClient.mockPut('/deals/1', updatedHot);

      const updated = await handler.updateDeal({ id: 1, deal: updateHot });
      expect(updated.temperature).toBe('hot');

      // Mark as won
      const updateWon = { status: 'won', closed_at: '2025-01-25T10:00:00Z' };
      const updatedWon = { ...updatedHot, ...updateWon };
      mockClient.mockPut('/deals/1', updatedWon);

      const won = await handler.updateDeal({ id: 1, deal: updateWon });
      expect(won.status).toBe('won');
    });

    it('should handle deal with full product quote', async () => {
      const dealWithQuote = {
        name: 'Software License Deal',
        value: 125000,
        company_id: 50,
        quote_items: [
          {
            name: 'Enterprise License',
            product_id: 1,
            price: 100000,
            quantity: 1,
            discount: 0
          },
          {
            name: 'Support Package',
            product_id: 2,
            price: 25000,
            quantity: 1,
            discount: 0
          }
        ]
      };
      const createdDeal = { id: 999, ...dealWithQuote };
      mockClient.mockPost('/deals', createdDeal);

      const result = await handler.createDeal({ deal: dealWithQuote });

      expect(result.quote_items).toHaveLength(2);
      expect(result.value).toBe(125000);
    });

    it('should handle deal reassignment', async () => {
      const mockDeal = {
        id: 100,
        name: 'Reassigned Deal',
        user_id: 5,
        team_id: 2
      };
      mockClient.mockGet('/deals/100', mockDeal);

      const original = await handler.getDeal({ id: 100 });
      expect(original.user_id).toBe(5);

      const updateData = { user_id: 10, team_id: 3 };
      const updatedDeal = { ...mockDeal, ...updateData };
      mockClient.mockPut('/deals/100', updatedDeal);

      const reassigned = await handler.updateDeal({ id: 100, deal: updateData });
      expect(reassigned.user_id).toBe(10);
      expect(reassigned.team_id).toBe(3);
    });
  });
});