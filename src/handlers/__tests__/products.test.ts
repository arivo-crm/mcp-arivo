import { ProductsHandler } from '../products';
import { MockArivoApiClient } from '../../__tests__/utils/mock-api-client';

describe('ProductsHandler', () => {
  let handler: ProductsHandler;
  let mockClient: MockArivoApiClient;

  beforeEach(() => {
    mockClient = new MockArivoApiClient() as any;
    handler = new ProductsHandler(mockClient as any);
  });

  afterEach(() => {
    mockClient.reset();
  });

  describe('listProducts', () => {
    it('should list products without filters', async () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', price: 100 },
        { id: '2', name: 'Product 2', price: 200 }
      ];
      mockClient.mockGet('/products', mockProducts);

      const result = await handler.listProducts();

      expect(result).toEqual(mockProducts);
      expect(mockClient.getLastCall().path).toBe('/products');
    });

    it('should list products with filters', async () => {
      const mockProducts = [{ id: '1', name: 'Product 1', price: 100 }];
      mockClient.mockGet('/products?per_page=10&product_category_id=5', mockProducts);

      const result = await handler.listProducts({ limit: 10, product_category_id: 5 });

      expect(result).toEqual(mockProducts);
      const path = mockClient.getLastCall().path;
      expect(path).toContain('per_page=10');
      expect(path).toContain('product_category_id=5');
    });

    it('should handle available filter', async () => {
      const mockProducts = [{ id: '1', name: 'Product 1', available: true }];
      mockClient.mockGet('/products?available=true', mockProducts);

      const result = await handler.listProducts({ available: true });

      expect(result).toEqual(mockProducts);
      expect(mockClient.getLastCall().path).toContain('available=true');
    });
  });

  describe('getProduct', () => {
    it('should get a product by id', async () => {
      const mockProduct = {
        id: '123',
        name: 'Test Product',
        price: 99.99,
        available: true
      };
      mockClient.mockGet('/products/123', mockProduct);

      const result = await handler.getProduct(123);

      expect(result).toEqual(mockProduct);
      expect(mockClient.getLastCall().path).toBe('/products/123');
    });
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const newProduct = {
        name: 'New Product',
        price: 49.99,
        product_category_id: 5
      };
      const createdProduct = {
        id: '123',
        ...newProduct,
        available: true
      };
      mockClient.mockPost('/products', createdProduct);

      const result = await handler.createProduct({ product: newProduct });

      expect(result).toEqual(createdProduct);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('POST');
      expect(lastCall.path).toBe('/products');
      expect(lastCall.data).toEqual(newProduct);
    });

    it('should throw error if name is missing', async () => {
      await expect(
        handler.createProduct({ product: { price: 100 } as any })
      ).rejects.toThrow('Product name is required');
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const updateData = { name: 'Updated Product', price: 79.99 };
      const updatedProduct = {
        id: '123',
        ...updateData,
        available: true
      };
      mockClient.mockPut('/products/123', updatedProduct);

      const result = await handler.updateProduct({ id: 123, product: updateData });

      expect(result).toEqual(updatedProduct);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('PUT');
      expect(lastCall.path).toBe('/products/123');
      expect(lastCall.data).toEqual(updateData);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      mockClient.mockDelete('/products/123', undefined);

      await handler.deleteProduct(123);

      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('DELETE');
      expect(lastCall.path).toBe('/products/123');
    });
  });
});