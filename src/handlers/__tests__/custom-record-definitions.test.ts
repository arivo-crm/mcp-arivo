import { CustomRecordDefinitionsHandler } from '../custom-record-definitions';
import { MockArivoApiClient } from '../../__tests__/utils/mock-api-client';

describe('CustomRecordDefinitionsHandler', () => {
  let handler: CustomRecordDefinitionsHandler;
  let mockClient: MockArivoApiClient;

  beforeEach(() => {
    mockClient = new MockArivoApiClient() as any;
    handler = new CustomRecordDefinitionsHandler(mockClient as any);
  });

  afterEach(() => {
    mockClient.reset();
  });

  describe('listCustomRecordDefinitions', () => {
    it('should list custom record definitions without filters', async () => {
      const mockDefinitions = [
        {
          id: 1,
          object: 'custom_record_definition',
          name: 'Contratos',
          definitions: {
            custom_data_validade: {
              label: 'Data de validade',
              field_type: 'date'
            }
          }
        },
        {
          id: 2,
          object: 'custom_record_definition',
          name: 'Notas Fiscais',
          definitions: {}
        }
      ];
      mockClient.mockGet('/custom_record_definitions', mockDefinitions);

      const result = await handler.listCustomRecordDefinitions();

      expect(result).toEqual(mockDefinitions);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('GET');
      expect(lastCall.path).toBe('/custom_record_definitions');
    });

    it('should list custom record definitions with limit', async () => {
      const mockDefinitions = [
        { id: 1, name: 'Definition 1', definitions: {} }
      ];
      mockClient.mockGet('/custom_record_definitions', mockDefinitions);

      const result = await handler.listCustomRecordDefinitions({ limit: 10 });

      expect(result).toEqual(mockDefinitions);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by name', async () => {
      const mockDefinitions = [
        { id: 3, name: 'Pizza', definitions: {} }
      ];
      mockClient.mockGet('/custom_record_definitions', mockDefinitions);

      const result = await handler.listCustomRecordDefinitions({ name: 'Pizza' });

      expect(result).toEqual(mockDefinitions);
      expect(result[0].name).toBe('Pizza');
    });

    it('should handle sorting options', async () => {
      const mockDefinitions = [
        { id: 1, name: 'A Definition', created_at: '2025-01-01' },
        { id: 2, name: 'B Definition', created_at: '2025-01-02' }
      ];
      mockClient.mockGet('/custom_record_definitions', mockDefinitions);

      const result = await handler.listCustomRecordDefinitions({
        sort_field: 'name',
        sort_order: 'asc'
      });

      expect(result).toEqual(mockDefinitions);
    });

    it('should handle multiple filters combined', async () => {
      const mockDefinitions = [
        { id: 1, name: 'Contract', definitions: {} }
      ];
      mockClient.mockGet('/custom_record_definitions', mockDefinitions);

      const result = await handler.listCustomRecordDefinitions({
        limit: 20,
        offset: 10,
        name: 'Contract',
        sort_field: 'created_at',
        sort_order: 'desc'
      });

      expect(result).toEqual(mockDefinitions);
    });

    it('should handle empty list response', async () => {
      mockClient.mockGet('/custom_record_definitions', []);

      const result = await handler.listCustomRecordDefinitions();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getCustomRecordDefinition', () => {
    it('should get a custom record definition by id', async () => {
      const mockDefinition = {
        id: 3,
        object: 'custom_record_definition',
        created_at: '2024-11-22T20:34:06-03:00',
        updated_at: '2024-11-22T20:34:34-03:00',
        name: 'Pizza',
        definitions: {
          custom_massa: {
            label: 'massa',
            field_type: 'list'
          },
          custom_cobertura: {
            label: 'cobertura',
            field_type: 'string'
          }
        }
      };
      mockClient.mockGet('/custom_record_definitions/3', mockDefinition);

      const result = await handler.getCustomRecordDefinition(3);

      expect(result).toEqual(mockDefinition);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('GET');
      expect(lastCall.path).toBe('/custom_record_definitions/3');
    });

    it('should handle definition with no custom fields', async () => {
      const mockDefinition = {
        id: 1,
        object: 'custom_record_definition',
        name: 'Empty Definition',
        definitions: {}
      };
      mockClient.mockGet('/custom_record_definitions/1', mockDefinition);

      const result = await handler.getCustomRecordDefinition(1);

      expect(result.definitions).toEqual({});
      expect(Object.keys(result.definitions!)).toHaveLength(0);
    });

    it('should handle definition with multiple field types', async () => {
      const mockDefinition = {
        id: 5,
        object: 'custom_record_definition',
        name: 'Comprehensive',
        definitions: {
          custom_text: { label: 'Text', field_type: 'string' },
          custom_number: { label: 'Number', field_type: 'number' },
          custom_date: { label: 'Date', field_type: 'date' },
          custom_list: { label: 'List', field_type: 'list' }
        }
      };
      mockClient.mockGet('/custom_record_definitions/5', mockDefinition);

      const result = await handler.getCustomRecordDefinition(5);

      expect(Object.keys(result.definitions!)).toHaveLength(4);
      expect(result.definitions!.custom_text.field_type).toBe('string');
      expect(result.definitions!.custom_number.field_type).toBe('number');
      expect(result.definitions!.custom_date.field_type).toBe('date');
      expect(result.definitions!.custom_list.field_type).toBe('list');
    });

    it('should handle definition without definitions property', async () => {
      const mockDefinition = {
        id: 2,
        object: 'custom_record_definition',
        name: 'Minimal Definition'
      };
      mockClient.mockGet('/custom_record_definitions/2', mockDefinition);

      const result = await handler.getCustomRecordDefinition(2);

      expect(result.definitions).toBeUndefined();
    });
  });

  describe('createCustomRecordDefinition', () => {
    it('should create a custom record definition', async () => {
      const newDefinition = { name: 'New Definition' };
      const createdDefinition = {
        id: 10,
        object: 'custom_record_definition',
        created_at: '2025-01-20T10:00:00Z',
        updated_at: '2025-01-20T10:00:00Z',
        name: 'New Definition',
        definitions: {}
      };
      mockClient.mockPost('/custom_record_definitions', createdDefinition);

      const result = await handler.createCustomRecordDefinition({
        custom_record_definition: newDefinition
      });

      expect(result).toEqual(createdDefinition);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('POST');
      expect(lastCall.path).toBe('/custom_record_definitions');
      expect(lastCall.data).toEqual(newDefinition);
    });

    it('should create definition with only name field', async () => {
      const newDefinition = { name: 'Contracts' };
      const createdDefinition = {
        id: 1,
        name: 'Contracts',
        definitions: {}
      };
      mockClient.mockPost('/custom_record_definitions', createdDefinition);

      const result = await handler.createCustomRecordDefinition({
        custom_record_definition: newDefinition
      });

      expect(result.name).toBe('Contracts');
      expect(result.id).toBeDefined();
    });

    it('should throw error if name is missing', async () => {
      await expect(
        handler.createCustomRecordDefinition({
          custom_record_definition: {} as any
        })
      ).rejects.toThrow('Custom record definition name is required');
    });

    it('should throw error if custom_record_definition is missing', async () => {
      await expect(
        handler.createCustomRecordDefinition({
          custom_record_definition: undefined as any
        })
      ).rejects.toThrow('Custom record definition name is required');
    });

    it('should handle names with special characters', async () => {
      const newDefinition = { name: 'Contratos & Acordos' };
      const createdDefinition = {
        id: 20,
        name: 'Contratos & Acordos',
        definitions: {}
      };
      mockClient.mockPost('/custom_record_definitions', createdDefinition);

      const result = await handler.createCustomRecordDefinition({
        custom_record_definition: newDefinition
      });

      expect(result.name).toBe('Contratos & Acordos');
    });

    it('should handle names with unicode characters', async () => {
      const newDefinition = { name: 'Contratos 合同' };
      const createdDefinition = {
        id: 21,
        name: 'Contratos 合同',
        definitions: {}
      };
      mockClient.mockPost('/custom_record_definitions', createdDefinition);

      const result = await handler.createCustomRecordDefinition({
        custom_record_definition: newDefinition
      });

      expect(result.name).toBe('Contratos 合同');
    });

    it('should handle long definition names', async () => {
      const longName = 'A'.repeat(255);
      const newDefinition = { name: longName };
      const createdDefinition = {
        id: 30,
        name: longName,
        definitions: {}
      };
      mockClient.mockPost('/custom_record_definitions', createdDefinition);

      const result = await handler.createCustomRecordDefinition({
        custom_record_definition: newDefinition
      });

      expect(result.name).toHaveLength(255);
    });
  });

  describe('updateCustomRecordDefinition', () => {
    it('should update a custom record definition', async () => {
      const updateData = { name: 'Updated Name' };
      const updatedDefinition = {
        id: 3,
        object: 'custom_record_definition',
        name: 'Updated Name',
        definitions: {}
      };
      mockClient.mockPut('/custom_record_definitions/3', updatedDefinition);

      const result = await handler.updateCustomRecordDefinition({
        id: 3,
        custom_record_definition: updateData
      });

      expect(result).toEqual(updatedDefinition);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('PUT');
      expect(lastCall.path).toBe('/custom_record_definitions/3');
      expect(lastCall.data).toEqual(updateData);
    });

    it('should update only the name field', async () => {
      const updateData = { name: 'Contracts Annual' };
      const updatedDefinition = {
        id: 1,
        name: 'Contracts Annual',
        definitions: {
          custom_field: { label: 'Field', field_type: 'string' }
        }
      };
      mockClient.mockPut('/custom_record_definitions/1', updatedDefinition);

      const result = await handler.updateCustomRecordDefinition({
        id: 1,
        custom_record_definition: updateData
      });

      expect(result.name).toBe('Contracts Annual');
      expect(result.definitions).toBeDefined();
    });

    it('should handle empty update data', async () => {
      const updateData = {};
      const updatedDefinition = {
        id: 2,
        name: 'Unchanged',
        definitions: {}
      };
      mockClient.mockPut('/custom_record_definitions/2', updatedDefinition);

      const result = await handler.updateCustomRecordDefinition({
        id: 2,
        custom_record_definition: updateData
      });

      expect(result).toEqual(updatedDefinition);
    });

    it('should preserve definitions when updating name', async () => {
      const updateData = { name: 'Pizza Updated' };
      const updatedDefinition = {
        id: 3,
        name: 'Pizza Updated',
        definitions: {
          custom_massa: { label: 'massa', field_type: 'list' },
          custom_cobertura: { label: 'cobertura', field_type: 'string' }
        }
      };
      mockClient.mockPut('/custom_record_definitions/3', updatedDefinition);

      const result = await handler.updateCustomRecordDefinition({
        id: 3,
        custom_record_definition: updateData
      });

      expect(result.name).toBe('Pizza Updated');
      expect(result.definitions).toBeDefined();
      expect(Object.keys(result.definitions!)).toHaveLength(2);
    });
  });

  describe('deleteCustomRecordDefinition', () => {
    it('should delete a custom record definition', async () => {
      mockClient.mockDelete('/custom_record_definitions/3', undefined);

      await handler.deleteCustomRecordDefinition(3);

      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('DELETE');
      expect(lastCall.path).toBe('/custom_record_definitions/3');
    });

    it('should handle deleting multiple definitions sequentially', async () => {
      mockClient.mockDelete('/custom_record_definitions/1', undefined);
      mockClient.mockDelete('/custom_record_definitions/2', undefined);
      mockClient.mockDelete('/custom_record_definitions/3', undefined);

      await handler.deleteCustomRecordDefinition(1);
      await handler.deleteCustomRecordDefinition(2);
      await handler.deleteCustomRecordDefinition(3);

      const history = mockClient.getCallHistory();
      expect(history).toHaveLength(3);
      expect(history[0].path).toBe('/custom_record_definitions/1');
      expect(history[1].path).toBe('/custom_record_definitions/2');
      expect(history[2].path).toBe('/custom_record_definitions/3');
    });

    it('should handle deleting with large ID numbers', async () => {
      mockClient.mockDelete('/custom_record_definitions/999999', undefined);

      await handler.deleteCustomRecordDefinition(999999);

      expect(mockClient.getLastCall().path).toBe('/custom_record_definitions/999999');
    });
  });

  describe('error handling', () => {
    it('should handle errors when listing definitions', async () => {
      const error = new Error('Network error');
      mockClient.mockError('GET', '/custom_record_definitions', error);

      await expect(handler.listCustomRecordDefinitions()).rejects.toThrow('Network error');
    });

    it('should handle errors when getting a definition', async () => {
      const error = new Error('Not found');
      mockClient.mockError('GET', '/custom_record_definitions/999', error);

      await expect(handler.getCustomRecordDefinition(999)).rejects.toThrow('Not found');
    });

    it('should handle errors when creating a definition', async () => {
      const error = new Error('Validation error');
      mockClient.mockError('POST', '/custom_record_definitions', error);

      await expect(
        handler.createCustomRecordDefinition({
          custom_record_definition: { name: 'Test' }
        })
      ).rejects.toThrow('Validation error');
    });

    it('should handle errors when updating a definition', async () => {
      const error = new Error('Unauthorized');
      mockClient.mockError('PUT', '/custom_record_definitions/1', error);

      await expect(
        handler.updateCustomRecordDefinition({
          id: 1,
          custom_record_definition: { name: 'Updated' }
        })
      ).rejects.toThrow('Unauthorized');
    });

    it('should handle errors when deleting a definition', async () => {
      const error = new Error('Forbidden');
      mockClient.mockError('DELETE', '/custom_record_definitions/5', error);

      await expect(handler.deleteCustomRecordDefinition(5)).rejects.toThrow('Forbidden');
    });
  });

  describe('real-world scenarios', () => {
    it('should handle Pizza custom record definition', async () => {
      const pizzaDefinition = {
        id: 3,
        object: 'custom_record_definition',
        created_at: '2024-11-22T20:34:06-03:00',
        updated_at: '2024-11-22T20:34:34-03:00',
        name: 'Pizza',
        definitions: {
          custom_massa: {
            label: 'massa',
            field_type: 'list'
          },
          custom_cobertura: {
            label: 'cobertura',
            field_type: 'string'
          }
        }
      };
      mockClient.mockGet('/custom_record_definitions/3', pizzaDefinition);

      const result = await handler.getCustomRecordDefinition(3);

      expect(result.name).toBe('Pizza');
      expect(result.definitions!.custom_massa.field_type).toBe('list');
      expect(result.definitions!.custom_cobertura.field_type).toBe('string');
    });

    it('should create a new contract definition', async () => {
      const newDefinition = { name: 'Contratos Anuais' };
      const createdDefinition = {
        id: 5,
        object: 'custom_record_definition',
        name: 'Contratos Anuais',
        definitions: {}
      };
      mockClient.mockPost('/custom_record_definitions', createdDefinition);

      const result = await handler.createCustomRecordDefinition({
        custom_record_definition: newDefinition
      });

      expect(result.name).toBe('Contratos Anuais');
      expect(result.id).toBe(5);
    });

    it('should list multiple custom record definitions', async () => {
      const definitions = [
        {
          id: 1,
          name: 'Contratos',
          definitions: {
            custom_validade: { label: 'Validade', field_type: 'date' }
          }
        },
        {
          id: 2,
          name: 'Notas Fiscais',
          definitions: {}
        },
        {
          id: 3,
          name: 'Pizza',
          definitions: {
            custom_massa: { label: 'Massa', field_type: 'list' },
            custom_cobertura: { label: 'Cobertura', field_type: 'string' }
          }
        }
      ];
      mockClient.mockGet('/custom_record_definitions', definitions);

      const result = await handler.listCustomRecordDefinitions();

      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('Contratos');
      expect(result[1].name).toBe('Notas Fiscais');
      expect(result[2].name).toBe('Pizza');
    });

    it('should update existing definition name', async () => {
      const updateData = { name: 'Contratos Anuais' };
      const updatedDefinition = {
        id: 1,
        name: 'Contratos Anuais',
        definitions: {
          custom_data_validade: {
            label: 'Data de validade',
            field_type: 'date'
          }
        }
      };
      mockClient.mockPut('/custom_record_definitions/1', updatedDefinition);

      const result = await handler.updateCustomRecordDefinition({
        id: 1,
        custom_record_definition: updateData
      });

      expect(result.name).toBe('Contratos Anuais');
      expect(result.definitions!.custom_data_validade).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle definition with very long name', async () => {
      const longName = 'Custom Record Definition '.repeat(20);
      const definition = {
        id: 100,
        name: longName,
        definitions: {}
      };
      mockClient.mockGet('/custom_record_definitions/100', definition);

      const result = await handler.getCustomRecordDefinition(100);

      expect(result.name).toBe(longName);
    });

    it('should handle definition with no fields defined yet', async () => {
      const definition = {
        id: 1,
        object: 'custom_record_definition',
        name: 'New Type',
        definitions: {}
      };
      mockClient.mockGet('/custom_record_definitions/1', definition);

      const result = await handler.getCustomRecordDefinition(1);

      expect(result.definitions).toBeDefined();
      expect(Object.keys(result.definitions!)).toHaveLength(0);
    });

    it('should handle list with pagination and offset', async () => {
      const definitions = [
        { id: 11, name: 'Definition 11', definitions: {} },
        { id: 12, name: 'Definition 12', definitions: {} }
      ];
      mockClient.mockGet('/custom_record_definitions', definitions);

      const result = await handler.listCustomRecordDefinitions({
        limit: 10,
        offset: 10
      });

      expect(result).toHaveLength(2);
    });
  });
});