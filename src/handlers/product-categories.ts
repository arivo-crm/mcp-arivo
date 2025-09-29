import { ArivoApiClient } from '../utils/http';

export interface ProductCategory {
  id: number;
  object?: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  code?: string;
}

export class ProductCategoriesHandler {
  constructor(private apiClient: ArivoApiClient) {}

  async listProductCategories(params?: {
    limit?: number;
    offset?: number;
    name?: string;
    code?: string;
    sort_field?: string;
    sort_order?: string;
  }): Promise<ProductCategory[]> {
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.append('per_page', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.name) queryParams.append('name', params.name);
    if (params?.code) queryParams.append('code', params.code);
    if (params?.sort_field) queryParams.append('sort_field', params.sort_field);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);

    const url = `/product_categories${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await this.apiClient.get<ProductCategory[]>(url);
  }

  async getProductCategory(id: number): Promise<ProductCategory> {
    return await this.apiClient.get<ProductCategory>(`/product_categories/${id}`);
  }

  async createProductCategory(args: { product_category: Omit<ProductCategory, 'id' | 'object' | 'created_at' | 'updated_at'> }): Promise<ProductCategory> {
    if (!args.product_category || !args.product_category.name) {
      throw new Error('Product category name is required');
    }
    return await this.apiClient.post<ProductCategory>('/product_categories', args.product_category);
  }

  async updateProductCategory(args: { id: number; product_category: Partial<Omit<ProductCategory, 'id' | 'object' | 'created_at' | 'updated_at'>> }): Promise<ProductCategory> {
    return await this.apiClient.put<ProductCategory>(`/product_categories/${args.id}`, args.product_category);
  }

  async deleteProductCategory(id: number): Promise<void> {
    await this.apiClient.delete(`/product_categories/${id}`);
  }
}

export const productCategoriesToolDefinitions = [
  {
    name: 'list_product_categories',
    description: 'List all product categories with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum number of product categories to return' },
        offset: { type: 'number', description: 'Number of product categories to skip' },
        name: { type: 'string', description: 'Filter by category name' },
        code: { type: 'string', description: 'Filter by category code' },
        sort_field: { type: 'string', description: 'Field to sort by (name, code, created_at, updated_at)' },
        sort_order: { type: 'string', description: 'Sort order (asc, desc)' }
      }
    }
  },
  {
    name: 'get_product_category',
    description: 'Get a specific product category by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Product category ID' }
      },
      required: ['id']
    }
  },
  {
    name: 'create_product_category',
    description: 'Create a new product category',
    inputSchema: {
      type: 'object',
      properties: {
        product_category: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Category name' },
            code: { type: 'string', description: 'Category code' }
          },
          required: ['name']
        }
      },
      required: ['product_category']
    }
  },
  {
    name: 'update_product_category',
    description: 'Update an existing product category',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Product category ID' },
        product_category: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Category name' },
            code: { type: 'string', description: 'Category code' }
          }
        }
      },
      required: ['id', 'product_category']
    }
  },
  {
    name: 'delete_product_category',
    description: 'Delete a product category',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Product category ID' }
      },
      required: ['id']
    }
  }
];