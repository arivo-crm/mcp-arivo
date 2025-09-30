import { ProductCategoriesHandler } from '../product-categories';
import { MockArivoApiClient } from '../../__tests__/utils/mock-api-client';

describe('ProductCategoriesHandler', () => {
  let handler: ProductCategoriesHandler;
  let mockClient: MockArivoApiClient;

  beforeEach(() => {
    mockClient = new MockArivoApiClient() as any;
    handler = new ProductCategoriesHandler(mockClient as any);
  });

  afterEach(() => {
    mockClient.reset();
  });

  describe('listProductCategories', () => {
    it('should list product categories without filters', async () => {
      const mockCategories = [
        { id: 1, name: 'Electronics', code: 'ELEC' },
        { id: 2, name: 'Furniture', code: 'FURN' },
        { id: 3, name: 'Software', code: 'SOFT' }
      ];
      mockClient.mockGet('/product_categories', mockCategories);

      const result = await handler.listProductCategories();

      expect(result).toEqual(mockCategories);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('GET');
      expect(lastCall.path).toBe('/product_categories');
    });

    it('should list product categories with pagination', async () => {
      const mockCategories = [{ id: 1, name: 'Category 1', code: 'CAT1' }];
      mockClient.mockGet('/product_categories', mockCategories);

      const result = await handler.listProductCategories({ limit: 10, offset: 5 });

      expect(result).toEqual(mockCategories);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by name', async () => {
      const mockCategories = [
        { id: 1, name: 'Electronics', code: 'ELEC' }
      ];
      mockClient.mockGet('/product_categories', mockCategories);

      const result = await handler.listProductCategories({ name: 'Electronics' });

      expect(result).toEqual(mockCategories);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by code', async () => {
      const mockCategories = [
        { id: 2, name: 'Furniture', code: 'FURN' }
      ];
      mockClient.mockGet('/product_categories', mockCategories);

      const result = await handler.listProductCategories({ code: 'FURN' });

      expect(result).toEqual(mockCategories);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle sorting options', async () => {
      const mockCategories = [
        { id: 1, name: 'A Category', code: 'A' },
        { id: 2, name: 'B Category', code: 'B' },
        { id: 3, name: 'C Category', code: 'C' }
      ];
      mockClient.mockGet('/product_categories', mockCategories);

      const result = await handler.listProductCategories({
        sort_field: 'name',
        sort_order: 'asc'
      });

      expect(result).toEqual(mockCategories);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle multiple filters combined', async () => {
      const mockCategories = [
        { id: 1, name: 'Electronics', code: 'ELEC' }
      ];
      mockClient.mockGet('/product_categories', mockCategories);

      const result = await handler.listProductCategories({
        name: 'Electronics',
        code: 'ELEC',
        limit: 20,
        sort_field: 'name',
        sort_order: 'desc'
      });

      expect(result).toEqual(mockCategories);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle empty list response', async () => {
      mockClient.mockGet('/product_categories', []);

      const result = await handler.listProductCategories();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getProductCategory', () => {
    it('should get a product category by id', async () => {
      const mockCategory = {
        id: 123,
        object: 'product_category',
        name: 'Electronics',
        code: 'ELEC',
        created_at: '2025-01-10T10:00:00Z',
        updated_at: '2025-01-15T14:00:00Z'
      };
      mockClient.mockGet('/product_categories/123', mockCategory);

      const result = await handler.getProductCategory(123);

      expect(result).toEqual(mockCategory);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('GET');
      expect(lastCall.path).toBe('/product_categories/123');
    });

    it('should handle category with minimal fields', async () => {
      const mockCategory = {
        id: 456,
        name: 'Software'
      };
      mockClient.mockGet('/product_categories/456', mockCategory);

      const result = await handler.getProductCategory(456);

      expect(result.id).toBe(456);
      expect(result.name).toBe('Software');
    });

    it('should handle category without code', async () => {
      const mockCategory = {
        id: 789,
        name: 'Services',
        object: 'product_category',
        created_at: '2025-01-20T10:00:00Z'
      };
      mockClient.mockGet('/product_categories/789', mockCategory);

      const result = await handler.getProductCategory(789);

      expect(result.name).toBe('Services');
      expect(result.code).toBeUndefined();
    });
  });

  describe('createProductCategory', () => {
    it('should create a product category with name and code', async () => {
      const newCategory = {
        name: 'Hardware',
        code: 'HARD'
      };
      const createdCategory = {
        id: 123,
        ...newCategory,
        object: 'product_category',
        created_at: '2025-01-20T14:30:00Z'
      };
      mockClient.mockPost('/product_categories', createdCategory);

      const result = await handler.createProductCategory({ product_category: newCategory });

      expect(result).toEqual(createdCategory);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('POST');
      expect(lastCall.path).toBe('/product_categories');
      expect(lastCall.data).toEqual(newCategory);
    });

    it('should create a product category with only name', async () => {
      const newCategory = {
        name: 'Consulting Services'
      };
      const createdCategory = {
        id: 456,
        ...newCategory,
        object: 'product_category',
        created_at: '2025-01-20T15:00:00Z'
      };
      mockClient.mockPost('/product_categories', createdCategory);

      const result = await handler.createProductCategory({ product_category: newCategory });

      expect(result.name).toBe('Consulting Services');
      expect(mockClient.getLastCall().data).toEqual(newCategory);
    });

    it('should throw error if name is missing', async () => {
      await expect(
        handler.createProductCategory({ product_category: { code: 'TEST' } as any })
      ).rejects.toThrow('Product category name is required');
    });

    it('should throw error if product_category object is missing', async () => {
      await expect(
        handler.createProductCategory({ product_category: undefined as any })
      ).rejects.toThrow('Product category name is required');
    });

    it('should create category with special characters in name', async () => {
      const newCategory = {
        name: 'Electronics & Appliances',
        code: 'ELEC-APP'
      };
      const createdCategory = { id: 789, ...newCategory };
      mockClient.mockPost('/product_categories', createdCategory);

      const result = await handler.createProductCategory({ product_category: newCategory });

      expect(result.name).toContain('&');
      expect(result.code).toContain('-');
    });

    it('should create category with unicode characters', async () => {
      const newCategory = {
        name: 'Eletrônicos e Acessórios',
        code: 'ELET'
      };
      const createdCategory = { id: 111, ...newCategory };
      mockClient.mockPost('/product_categories', createdCategory);

      const result = await handler.createProductCategory({ product_category: newCategory });

      expect(result.name).toContain('Eletrônicos');
    });
  });

  describe('updateProductCategory', () => {
    it('should update a product category name', async () => {
      const updateData = { name: 'Updated Electronics' };
      const updatedCategory = {
        id: 123,
        name: 'Updated Electronics',
        code: 'ELEC',
        updated_at: '2025-01-20T16:00:00Z'
      };
      mockClient.mockPut('/product_categories/123', updatedCategory);

      const result = await handler.updateProductCategory({ id: 123, product_category: updateData });

      expect(result).toEqual(updatedCategory);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('PUT');
      expect(lastCall.path).toBe('/product_categories/123');
      expect(lastCall.data).toEqual(updateData);
    });

    it('should update a product category code', async () => {
      const updateData = { code: 'ELECT' };
      const updatedCategory = {
        id: 456,
        name: 'Electronics',
        code: 'ELECT',
        updated_at: '2025-01-20T16:30:00Z'
      };
      mockClient.mockPut('/product_categories/456', updatedCategory);

      const result = await handler.updateProductCategory({ id: 456, product_category: updateData });

      expect(result.code).toBe('ELECT');
    });

    it('should update both name and code', async () => {
      const updateData = {
        name: 'Consumer Electronics',
        code: 'CE'
      };
      const updatedCategory = {
        id: 789,
        ...updateData,
        updated_at: '2025-01-20T17:00:00Z'
      };
      mockClient.mockPut('/product_categories/789', updatedCategory);

      const result = await handler.updateProductCategory({ id: 789, product_category: updateData });

      expect(result.name).toBe('Consumer Electronics');
      expect(result.code).toBe('CE');
    });

    it('should handle empty update data', async () => {
      const updateData = {};
      const updatedCategory = {
        id: 111,
        name: 'Unchanged',
        code: 'UNCH'
      };
      mockClient.mockPut('/product_categories/111', updatedCategory);

      const result = await handler.updateProductCategory({ id: 111, product_category: updateData });

      expect(result).toEqual(updatedCategory);
    });
  });

  describe('deleteProductCategory', () => {
    it('should delete a product category', async () => {
      mockClient.mockDelete('/product_categories/123', undefined);

      await handler.deleteProductCategory(123);

      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('DELETE');
      expect(lastCall.path).toBe('/product_categories/123');
    });

    it('should handle deleting multiple categories sequentially', async () => {
      mockClient.mockDelete('/product_categories/1', undefined);
      mockClient.mockDelete('/product_categories/2', undefined);
      mockClient.mockDelete('/product_categories/3', undefined);

      await handler.deleteProductCategory(1);
      await handler.deleteProductCategory(2);
      await handler.deleteProductCategory(3);

      const history = mockClient.getCallHistory();
      expect(history).toHaveLength(3);
      expect(history[0].path).toBe('/product_categories/1');
      expect(history[1].path).toBe('/product_categories/2');
      expect(history[2].path).toBe('/product_categories/3');
    });
  });

  describe('error handling', () => {
    it('should handle errors when listing categories', async () => {
      const error = new Error('Network error');
      mockClient.mockError('GET', '/product_categories', error);

      await expect(handler.listProductCategories()).rejects.toThrow('Network error');
    });

    it('should handle errors when getting a category', async () => {
      const error = new Error('Not found');
      mockClient.mockError('GET', '/product_categories/999', error);

      await expect(handler.getProductCategory(999)).rejects.toThrow('Not found');
    });

    it('should handle errors when creating a category', async () => {
      const error = new Error('Validation error');
      mockClient.mockError('POST', '/product_categories', error);

      await expect(
        handler.createProductCategory({ product_category: { name: 'Test' } })
      ).rejects.toThrow('Validation error');
    });

    it('should handle errors when updating a category', async () => {
      const error = new Error('Unauthorized');
      mockClient.mockError('PUT', '/product_categories/123', error);

      await expect(
        handler.updateProductCategory({ id: 123, product_category: { name: 'Updated' } })
      ).rejects.toThrow('Unauthorized');
    });

    it('should handle errors when deleting a category', async () => {
      const error = new Error('Forbidden');
      mockClient.mockError('DELETE', '/product_categories/123', error);

      await expect(handler.deleteProductCategory(123)).rejects.toThrow('Forbidden');
    });
  });

  describe('edge cases', () => {
    it('should handle category name with long text', async () => {
      const longName = 'A'.repeat(200);
      const mockCategory = {
        id: 1,
        name: longName,
        code: 'LONG'
      };
      mockClient.mockGet('/product_categories/1', mockCategory);

      const result = await handler.getProductCategory(1);

      expect(result.name.length).toBe(200);
    });

    it('should handle category code with uppercase letters', async () => {
      const newCategory = {
        name: 'Test Category',
        code: 'TEST-123-ABC'
      };
      const createdCategory = { id: 1, ...newCategory };
      mockClient.mockPost('/product_categories', createdCategory);

      const result = await handler.createProductCategory({ product_category: newCategory });

      expect(result.code).toBe('TEST-123-ABC');
    });

    it('should handle category with very short name', async () => {
      const newCategory = {
        name: 'IT',
        code: 'IT'
      };
      const createdCategory = { id: 1, ...newCategory };
      mockClient.mockPost('/product_categories', createdCategory);

      const result = await handler.createProductCategory({ product_category: newCategory });

      expect(result.name).toBe('IT');
    });

    it('should handle list with single category', async () => {
      const mockCategories = [
        { id: 1, name: 'Only Category', code: 'ONLY' }
      ];
      mockClient.mockGet('/product_categories', mockCategories);

      const result = await handler.listProductCategories();

      expect(result).toHaveLength(1);
    });

    it('should handle list with many categories', async () => {
      const mockCategories = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Category ${i + 1}`,
        code: `CAT${i + 1}`
      }));
      mockClient.mockGet('/product_categories', mockCategories);

      const result = await handler.listProductCategories();

      expect(result).toHaveLength(100);
    });

    it('should handle category name with numbers', async () => {
      const newCategory = {
        name: 'Category 2025',
        code: '2025'
      };
      const createdCategory = { id: 1, ...newCategory };
      mockClient.mockPost('/product_categories', createdCategory);

      const result = await handler.createProductCategory({ product_category: newCategory });

      expect(result.name).toBe('Category 2025');
    });

    it('should handle category with parentheses', async () => {
      const newCategory = {
        name: 'Electronics (Consumer)',
        code: 'ELEC-C'
      };
      const createdCategory = { id: 1, ...newCategory };
      mockClient.mockPost('/product_categories', createdCategory);

      const result = await handler.createProductCategory({ product_category: newCategory });

      expect(result.name).toContain('(Consumer)');
    });
  });

  describe('real-world scenarios', () => {
    it('should handle standard product categories', async () => {
      const mockCategories = [
        { id: 1, name: 'Electronics', code: 'ELEC' },
        { id: 2, name: 'Clothing', code: 'CLTH' },
        { id: 3, name: 'Food & Beverages', code: 'F&B' },
        { id: 4, name: 'Home & Garden', code: 'H&G' },
        { id: 5, name: 'Sports & Outdoors', code: 'SPRT' }
      ];
      mockClient.mockGet('/product_categories', mockCategories);

      const result = await handler.listProductCategories();

      expect(result).toHaveLength(5);
      expect(result[0].name).toBe('Electronics');
      expect(result[2].code).toBe('F&B');
    });

    it('should handle software product categories', async () => {
      const mockCategories = [
        { id: 10, name: 'SaaS Licenses', code: 'SAAS' },
        { id: 11, name: 'Professional Services', code: 'PROF-SVC' },
        { id: 12, name: 'Support & Maintenance', code: 'SUPP' },
        { id: 13, name: 'Training', code: 'TRAIN' }
      ];
      mockClient.mockGet('/product_categories', mockCategories);

      const result = await handler.listProductCategories();

      expect(result).toHaveLength(4);
      expect(result.map(c => c.name)).toContain('SaaS Licenses');
    });

    it('should handle category creation workflow', async () => {
      // Create new category
      const newCategory = {
        name: 'Cloud Services',
        code: 'CLOUD'
      };
      const createdCategory = {
        id: 100,
        ...newCategory,
        created_at: '2025-01-20T10:00:00Z'
      };
      mockClient.mockPost('/product_categories', createdCategory);

      const created = await handler.createProductCategory({ product_category: newCategory });
      expect(created.id).toBe(100);

      // Update category name
      const updateData = { name: 'Cloud Computing Services' };
      const updatedCategory = {
        ...createdCategory,
        name: 'Cloud Computing Services',
        updated_at: '2025-01-20T11:00:00Z'
      };
      mockClient.mockPut('/product_categories/100', updatedCategory);

      const updated = await handler.updateProductCategory({
        id: 100,
        product_category: updateData
      });
      expect(updated.name).toBe('Cloud Computing Services');
    });

    it('should handle hierarchical naming convention', async () => {
      const mockCategories = [
        { id: 1, name: 'Technology', code: 'TECH' },
        { id: 2, name: 'Technology > Hardware', code: 'TECH-HW' },
        { id: 3, name: 'Technology > Software', code: 'TECH-SW' },
        { id: 4, name: 'Technology > Hardware > Computers', code: 'TECH-HW-COMP' },
        { id: 5, name: 'Technology > Hardware > Peripherals', code: 'TECH-HW-PERI' }
      ];
      mockClient.mockGet('/product_categories', mockCategories);

      const result = await handler.listProductCategories();

      expect(result).toHaveLength(5);
      expect(result[3].name).toContain('Computers');
      expect(result[3].code).toBe('TECH-HW-COMP');
    });

    it('should handle industry-specific categories', async () => {
      const newCategory = {
        name: 'Medical Equipment',
        code: 'MED-EQUIP'
      };
      const createdCategory = { id: 200, ...newCategory };
      mockClient.mockPost('/product_categories', createdCategory);

      const result = await handler.createProductCategory({ product_category: newCategory });

      expect(result.name).toBe('Medical Equipment');
      expect(result.code).toBe('MED-EQUIP');
    });

    it('should handle category search by partial name', async () => {
      const mockCategories = [
        { id: 1, name: 'Software Development', code: 'SW-DEV' },
        { id: 2, name: 'Software Licenses', code: 'SW-LIC' },
        { id: 3, name: 'Software Training', code: 'SW-TRAIN' }
      ];
      mockClient.mockGet('/product_categories', mockCategories);

      const result = await handler.listProductCategories({ name: 'Software' });

      expect(result).toHaveLength(3);
      expect(result.every(c => c.name.includes('Software'))).toBe(true);
    });

    it('should handle category with timestamps', async () => {
      const mockCategory = {
        id: 300,
        name: 'Consulting',
        code: 'CONSULT',
        object: 'product_category',
        created_at: '2024-06-01T08:00:00Z',
        updated_at: '2025-01-20T14:30:00Z'
      };
      mockClient.mockGet('/product_categories/300', mockCategory);

      const result = await handler.getProductCategory(300);

      expect(result.created_at).toBe('2024-06-01T08:00:00Z');
      expect(result.updated_at).toBe('2025-01-20T14:30:00Z');
    });
  });
});