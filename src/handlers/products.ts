import { ArivoApiClient } from '../utils/http';

export interface Product {
  id?: number;
  object?: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  description?: string;
  code?: string;
  price?: number;
  available?: boolean;
  product_category_id?: number;
  tags?: string[];
}

export class ProductsHandler {
  constructor(private apiClient: ArivoApiClient) {}

  async listProducts(params?: {
    limit?: number;
    offset?: number;
    name?: string;
    code?: string;
    product_category_id?: number;
    available?: boolean;
    search?: string;
    tags?: string;
    sort_field?: string;
    sort_order?: string;
  }): Promise<Product[]> {
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.append('per_page', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.name) queryParams.append('name', params.name);
    if (params?.code) queryParams.append('code', params.code);
    if (params?.product_category_id) queryParams.append('product_category_id', params.product_category_id.toString());
    if (params?.available !== undefined) queryParams.append('available', params.available.toString());
    if (params?.tags) queryParams.append('tags', params.tags);
    if (params?.sort_field) queryParams.append('sort_field', params.sort_field);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);

    const url = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await this.apiClient.get<Product[]>(url);
  }

  async getProduct(id: number): Promise<Product> {
    return await this.apiClient.get<Product>(`/products/${id}`);
  }

  async createProduct(args: { product: Omit<Product, 'id' | 'object' | 'created_at' | 'updated_at'> }): Promise<Product> {
    if (!args.product || !args.product.name) {
      throw new Error('Product name is required');
    }
    return await this.apiClient.post<Product>('/products', args.product);
  }

  async updateProduct(args: { id: number; product: Partial<Omit<Product, 'id' | 'object' | 'created_at' | 'updated_at'>> }): Promise<Product> {
    return await this.apiClient.put<Product>(`/products/${args.id}`, args.product);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.apiClient.delete(`/products/${id}`);
  }
}

export const productsToolDefinitions = [
  {
    name: 'list_products',
    description: 'List all products with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum number of products to return' },
        offset: { type: 'number', description: 'Number of products to skip' },
        name: { type: 'string', description: 'Filter by product name' },
        code: { type: 'string', description: 'Filter by product code' },
        product_category_id: { type: 'number', description: 'Filter by product category ID' },
        available: { type: 'boolean', description: 'Filter by availability status' },
        search: { type: 'string', description: 'Search term to filter products' },
        tags: { type: 'string', description: 'Filter by tags (comma-separated)' },
        sort_field: { type: 'string', description: 'Field to sort by (name, code, price, created_at, updated_at)' },
        sort_order: { type: 'string', description: 'Sort order (asc, desc)' }
      }
    }
  },
  {
    name: 'get_product',
    description: 'Get a specific product by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Product ID' }
      },
      required: ['id']
    }
  },
  {
    name: 'create_product',
    description: 'Create a new product',
    inputSchema: {
      type: 'object',
      properties: {
        product: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Product name' },
            description: { type: 'string', description: 'Product description' },
            code: { type: 'string', description: 'Product code' },
            price: { type: 'number', description: 'Product price' },
            available: { type: 'boolean', description: 'Product availability status' },
            product_category_id: { type: 'number', description: 'Product category ID' },
            tags: { type: 'array', items: { type: 'string' }, description: 'Array of tags' }
          },
          required: ['name']
        }
      },
      required: ['product']
    }
  },
  {
    name: 'update_product',
    description: 'Update an existing product',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Product ID' },
        product: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Product name' },
            description: { type: 'string', description: 'Product description' },
            code: { type: 'string', description: 'Product code' },
            price: { type: 'number', description: 'Product price' },
            available: { type: 'boolean', description: 'Product availability status' },
            product_category_id: { type: 'number', description: 'Product category ID' },
            tags: { type: 'array', items: { type: 'string' }, description: 'Array of tags' }
          }
        }
      },
      required: ['id', 'product']
    }
  },
  {
    name: 'delete_product',
    description: 'Delete a product',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Product ID' }
      },
      required: ['id']
    }
  }
];