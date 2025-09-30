import { CustomFieldsHandler } from '../custom-fields';
import { MockArivoApiClient } from '../../__tests__/utils/mock-api-client';

describe('CustomFieldsHandler', () => {
  let handler: CustomFieldsHandler;
  let mockClient: MockArivoApiClient;

  beforeEach(() => {
    mockClient = new MockArivoApiClient() as any;
    handler = new CustomFieldsHandler(mockClient as any);
  });

  afterEach(() => {
    mockClient.reset();
  });

  describe('getCustomFields', () => {
    describe('for built-in record types', () => {
      it('should get custom fields for person', async () => {
        const mockFields = {
          custom_birth_city: {
            label: 'Cidade de nascimento',
            field_type: 'string' as const,
            order: 0
          },
          custom_salary: {
            label: 'Salário',
            field_type: 'number' as const,
            order: 1
          }
        };
        mockClient.mockGet('/custom_fields/person', mockFields);

        const result = await handler.getCustomFields({ id: 'person' });

        expect(result).toEqual(mockFields);
        const lastCall = mockClient.getLastCall();
        expect(lastCall.method).toBe('GET');
        expect(lastCall.path).toBe('/custom_fields/person');
      });

      it('should get custom fields for company', async () => {
        const mockFields = {
          custom_industry: {
            label: 'Indústria',
            field_type: 'list' as const,
            order: 0,
            list: ['Tecnologia', 'Varejo', 'Serviços']
          },
          custom_founded_year: {
            label: 'Ano de fundação',
            field_type: 'number' as const,
            order: 1
          }
        };
        mockClient.mockGet('/custom_fields/company', mockFields);

        const result = await handler.getCustomFields({ id: 'company' });

        expect(result).toEqual(mockFields);
        expect(mockClient.getLastCall().path).toBe('/custom_fields/company');
      });

      it('should get custom fields for deal', async () => {
        const mockFields = {
          custom_expected_close_date: {
            label: 'Data esperada de fechamento',
            field_type: 'date' as const,
            order: 0
          },
          custom_deal_source: {
            label: 'Fonte do negócio',
            field_type: 'list' as const,
            order: 1,
            list: ['Indicação', 'Website', 'Evento', 'Outro']
          }
        };
        mockClient.mockGet('/custom_fields/deal', mockFields);

        const result = await handler.getCustomFields({ id: 'deal' });

        expect(result).toEqual(mockFields);
        expect(mockClient.getLastCall().path).toBe('/custom_fields/deal');
      });
    });

    describe('for custom record types', () => {
      it('should get custom fields for numeric custom record type ID', async () => {
        const mockFields = {
          custom_contract_number: {
            label: 'Número do contrato',
            field_type: 'string' as const,
            order: 0
          },
          custom_contract_value: {
            label: 'Valor do contrato',
            field_type: 'number' as const,
            order: 1
          },
          custom_renewal_date: {
            label: 'Data de renovação',
            field_type: 'date' as const,
            order: 2
          }
        };
        mockClient.mockGet('/custom_fields/123', mockFields);

        const result = await handler.getCustomFields({ id: '123' });

        expect(result).toEqual(mockFields);
        expect(mockClient.getLastCall().path).toBe('/custom_fields/123');
      });

      it('should handle custom fields with list type', async () => {
        const mockFields = {
          custom_status: {
            label: 'Status',
            field_type: 'list' as const,
            order: 0,
            list: ['Ativo', 'Inativo', 'Pendente', 'Cancelado']
          }
        };
        mockClient.mockGet('/custom_fields/456', mockFields);

        const result = await handler.getCustomFields({ id: '456' });

        expect(result.custom_status.field_type).toBe('list');
        expect(result.custom_status.list).toHaveLength(4);
        expect(result.custom_status.list).toContain('Ativo');
      });
    });

    describe('field types', () => {
      it('should handle string type fields', async () => {
        const mockFields = {
          custom_text_field: {
            label: 'Campo de texto',
            field_type: 'string' as const,
            order: 0
          }
        };
        mockClient.mockGet('/custom_fields/person', mockFields);

        const result = await handler.getCustomFields({ id: 'person' });

        expect(result.custom_text_field.field_type).toBe('string');
      });

      it('should handle number type fields', async () => {
        const mockFields = {
          custom_numeric_field: {
            label: 'Campo numérico',
            field_type: 'number' as const,
            order: 0
          }
        };
        mockClient.mockGet('/custom_fields/person', mockFields);

        const result = await handler.getCustomFields({ id: 'person' });

        expect(result.custom_numeric_field.field_type).toBe('number');
      });

      it('should handle date type fields', async () => {
        const mockFields = {
          custom_date_field: {
            label: 'Campo de data',
            field_type: 'date' as const,
            order: 0
          }
        };
        mockClient.mockGet('/custom_fields/person', mockFields);

        const result = await handler.getCustomFields({ id: 'person' });

        expect(result.custom_date_field.field_type).toBe('date');
      });

      it('should handle list type fields with options', async () => {
        const mockFields = {
          custom_list_field: {
            label: 'Campo de lista',
            field_type: 'list' as const,
            order: 0,
            list: ['Opção 1', 'Opção 2', 'Opção 3']
          }
        };
        mockClient.mockGet('/custom_fields/person', mockFields);

        const result = await handler.getCustomFields({ id: 'person' });

        expect(result.custom_list_field.field_type).toBe('list');
        expect(result.custom_list_field.list).toBeDefined();
        expect(result.custom_list_field.list).toEqual(['Opção 1', 'Opção 2', 'Opção 3']);
      });
    });

    describe('field ordering', () => {
      it('should preserve field order property', async () => {
        const mockFields = {
          custom_field_1: {
            label: 'Campo 1',
            field_type: 'string' as const,
            order: 0
          },
          custom_field_2: {
            label: 'Campo 2',
            field_type: 'string' as const,
            order: 1
          },
          custom_field_3: {
            label: 'Campo 3',
            field_type: 'string' as const,
            order: 2
          }
        };
        mockClient.mockGet('/custom_fields/person', mockFields);

        const result = await handler.getCustomFields({ id: 'person' });

        expect(result.custom_field_1.order).toBe(0);
        expect(result.custom_field_2.order).toBe(1);
        expect(result.custom_field_3.order).toBe(2);
      });

      it('should handle fields without order property', async () => {
        const mockFields = {
          custom_field_no_order: {
            label: 'Campo sem ordem',
            field_type: 'string' as const
          }
        };
        mockClient.mockGet('/custom_fields/person', mockFields);

        const result = await handler.getCustomFields({ id: 'person' });

        expect(result.custom_field_no_order.order).toBeUndefined();
      });
    });

    describe('edge cases', () => {
      it('should handle empty custom fields response', async () => {
        const mockFields = {};
        mockClient.mockGet('/custom_fields/person', mockFields);

        const result = await handler.getCustomFields({ id: 'person' });

        expect(result).toEqual({});
        expect(Object.keys(result)).toHaveLength(0);
      });

      it('should handle large number of custom fields', async () => {
        const mockFields: any = {};
        for (let i = 0; i < 50; i++) {
          mockFields[`custom_field_${i}`] = {
            label: `Campo ${i}`,
            field_type: 'string' as const,
            order: i
          };
        }
        mockClient.mockGet('/custom_fields/person', mockFields);

        const result = await handler.getCustomFields({ id: 'person' });

        expect(Object.keys(result)).toHaveLength(50);
        expect(result.custom_field_0).toBeDefined();
        expect(result.custom_field_49).toBeDefined();
      });

      it('should handle custom field names with special characters', async () => {
        const mockFields = {
          'custom_field_with_underscore': {
            label: 'Campo com underscore',
            field_type: 'string' as const,
            order: 0
          },
          'custom_número': {
            label: 'Campo com acento',
            field_type: 'number' as const,
            order: 1
          }
        };
        mockClient.mockGet('/custom_fields/person', mockFields);

        const result = await handler.getCustomFields({ id: 'person' });

        expect(result['custom_field_with_underscore']).toBeDefined();
        expect(result['custom_número']).toBeDefined();
      });

      it('should handle list with single option', async () => {
        const mockFields = {
          custom_single_option: {
            label: 'Única opção',
            field_type: 'list' as const,
            order: 0,
            list: ['Única']
          }
        };
        mockClient.mockGet('/custom_fields/person', mockFields);

        const result = await handler.getCustomFields({ id: 'person' });

        expect(result.custom_single_option.list).toHaveLength(1);
        expect(result.custom_single_option.list![0]).toBe('Única');
      });

      it('should handle list with many options', async () => {
        const options = Array.from({ length: 100 }, (_, i) => `Opção ${i + 1}`);
        const mockFields = {
          custom_many_options: {
            label: 'Muitas opções',
            field_type: 'list' as const,
            order: 0,
            list: options
          }
        };
        mockClient.mockGet('/custom_fields/person', mockFields);

        const result = await handler.getCustomFields({ id: 'person' });

        expect(result.custom_many_options.list).toHaveLength(100);
        expect(result.custom_many_options.list![0]).toBe('Opção 1');
        expect(result.custom_many_options.list![99]).toBe('Opção 100');
      });
    });

    describe('validation', () => {
      it('should throw error if id is missing', async () => {
        await expect(
          handler.getCustomFields({ id: '' })
        ).rejects.toThrow('Record type ID is required');
      });

      it('should throw error for invalid id', async () => {
        await expect(
          handler.getCustomFields({ id: 'invalid-type' })
        ).rejects.toThrow('Invalid record type ID');
      });

      it('should throw error for id with special characters', async () => {
        await expect(
          handler.getCustomFields({ id: 'person@#$' })
        ).rejects.toThrow('Invalid record type ID');
      });

      it('should accept valid built-in types', async () => {
        const mockFields = {};
        mockClient.mockGet('/custom_fields/person', mockFields);
        mockClient.mockGet('/custom_fields/company', mockFields);
        mockClient.mockGet('/custom_fields/deal', mockFields);

        await expect(handler.getCustomFields({ id: 'person' })).resolves.toBeDefined();
        await expect(handler.getCustomFields({ id: 'company' })).resolves.toBeDefined();
        await expect(handler.getCustomFields({ id: 'deal' })).resolves.toBeDefined();
      });

      it('should accept numeric string IDs', async () => {
        const mockFields = {};
        mockClient.mockGet('/custom_fields/1', mockFields);
        mockClient.mockGet('/custom_fields/999', mockFields);
        mockClient.mockGet('/custom_fields/123456', mockFields);

        await expect(handler.getCustomFields({ id: '1' })).resolves.toBeDefined();
        await expect(handler.getCustomFields({ id: '999' })).resolves.toBeDefined();
        await expect(handler.getCustomFields({ id: '123456' })).resolves.toBeDefined();
      });

      it('should reject alphanumeric IDs that are not built-in types', async () => {
        await expect(
          handler.getCustomFields({ id: '123abc' })
        ).rejects.toThrow('Invalid record type ID');
      });
    });

    describe('error handling', () => {
      it('should handle API errors', async () => {
        const error = new Error('Not found');
        mockClient.mockError('GET', '/custom_fields/person', error);

        await expect(handler.getCustomFields({ id: 'person' })).rejects.toThrow('Not found');
      });

      it('should handle unauthorized errors', async () => {
        const error = new Error('Unauthorized');
        mockClient.mockError('GET', '/custom_fields/company', error);

        await expect(handler.getCustomFields({ id: 'company' })).rejects.toThrow('Unauthorized');
      });

      it('should handle network errors', async () => {
        const error = new Error('Network error');
        mockClient.mockError('GET', '/custom_fields/deal', error);

        await expect(handler.getCustomFields({ id: 'deal' })).rejects.toThrow('Network error');
      });
    });

    describe('real-world scenarios', () => {
      it('should handle Pizza custom record definition fields', async () => {
        const mockFields = {
          custom_massa: {
            list: ['fina', 'pan'],
            label: 'massa',
            order: 1,
            field_type: 'list' as const
          },
          custom_cobertura: {
            label: 'cobertura',
            order: 0,
            field_type: 'string' as const
          }
        };
        mockClient.mockGet('/custom_fields/3', mockFields);

        const result = await handler.getCustomFields({ id: '3' });

        expect(result.custom_massa.field_type).toBe('list');
        expect(result.custom_massa.list).toContain('fina');
        expect(result.custom_massa.list).toContain('pan');
        expect(result.custom_cobertura.field_type).toBe('string');
      });

      it('should handle contact custom fields with multiple types', async () => {
        const mockFields = {
          custom_birth_date: {
            label: 'Data de nascimento',
            field_type: 'date' as const,
            order: 0
          },
          custom_age: {
            label: 'Idade',
            field_type: 'number' as const,
            order: 1
          },
          custom_notes: {
            label: 'Observações',
            field_type: 'string' as const,
            order: 2
          },
          custom_category: {
            label: 'Categoria',
            field_type: 'list' as const,
            order: 3,
            list: ['VIP', 'Regular', 'Novo']
          }
        };
        mockClient.mockGet('/custom_fields/person', mockFields);

        const result = await handler.getCustomFields({ id: 'person' });

        expect(Object.keys(result)).toHaveLength(4);
        expect(result.custom_birth_date.field_type).toBe('date');
        expect(result.custom_age.field_type).toBe('number');
        expect(result.custom_notes.field_type).toBe('string');
        expect(result.custom_category.field_type).toBe('list');
        expect(result.custom_category.list).toHaveLength(3);
      });
    });
  });
});