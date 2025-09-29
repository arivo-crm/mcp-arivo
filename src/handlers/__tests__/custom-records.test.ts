import { CustomRecordsHandler } from '../custom-records';
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
    it('should list custom record definitions', async () => {
      const mockDefinitions = [
        {
          id: 1,
          name: 'Pizza',
          definitions: {
            custom_cobertura: { label: 'Cobertura', field_type: 'string' }
          }
        }
      ];
      mockClient.mockGet('/custom_record_definitions', mockDefinitions);

      const result = await handler.listCustomRecordDefinitions();

      expect(result).toEqual(mockDefinitions);
      expect(mockClient.getLastCall().path).toBe('/custom_record_definitions');
    });

    it('should filter by name', async () => {
      const mockDefinitions = [{ id: 1, name: 'Pizza' }];
      mockClient.mockGet('/custom_record_definitions?name=Pizza', mockDefinitions);

      const result = await handler.listCustomRecordDefinitions({ name: 'Pizza' });

      expect(result).toEqual(mockDefinitions);
      expect(mockClient.getLastCall().path).toContain('name=Pizza');
    });
  });

  describe('getCustomRecordDefinition', () => {
    it('should get a custom record definition by id', async () => {
      const mockDefinition = {
        id: 3,
        name: 'Pizza',
        definitions: {
          custom_cobertura: { label: 'Cobertura', field_type: 'string' }
        }
      };
      mockClient.mockGet('/custom_record_definitions/3', mockDefinition);

      const result = await handler.getCustomRecordDefinition(3);

      expect(result).toEqual(mockDefinition);
      expect(mockClient.getLastCall().path).toBe('/custom_record_definitions/3');
    });
  });

  describe('createCustomRecordDefinition', () => {
    it('should create a custom record definition', async () => {
      const newDefinition = { name: 'Contracts' };
      const createdDefinition = {
        id: 5,
        ...newDefinition,
        definitions: {}
      };
      mockClient.mockPost('/custom_record_definitions', createdDefinition);

      const result = await handler.createCustomRecordDefinition({
        custom_record_definition: newDefinition
      });

      expect(result).toEqual(createdDefinition);
      expect(mockClient.getLastCall().data).toEqual(newDefinition);
    });

    it('should throw error if name is missing', async () => {
      await expect(
        handler.createCustomRecordDefinition({
          custom_record_definition: {} as any
        })
      ).rejects.toThrow('Custom record definition name is required');
    });
  });

  describe('updateCustomRecordDefinition', () => {
    it('should update a custom record definition', async () => {
      const updateData = { name: 'Updated Name' };
      const updatedDefinition = { id: 3, ...updateData };
      mockClient.mockPut('/custom_record_definitions/3', updatedDefinition);

      const result = await handler.updateCustomRecordDefinition({
        id: 3,
        custom_record_definition: updateData
      });

      expect(result).toEqual(updatedDefinition);
      expect(mockClient.getLastCall().data).toEqual(updateData);
    });
  });

  describe('deleteCustomRecordDefinition', () => {
    it('should delete a custom record definition', async () => {
      mockClient.mockDelete('/custom_record_definitions/3', undefined);

      await handler.deleteCustomRecordDefinition(3);

      expect(mockClient.getLastCall().path).toBe('/custom_record_definitions/3');
    });
  });
});

describe('CustomRecordsHandler', () => {
  let handler: CustomRecordsHandler;
  let mockClient: MockArivoApiClient;

  beforeEach(() => {
    mockClient = new MockArivoApiClient() as any;
    handler = new CustomRecordsHandler(mockClient as any);
  });

  afterEach(() => {
    mockClient.reset();
  });

  describe('listCustomRecords', () => {
    it('should list custom records for a definition', async () => {
      const mockRecords = [
        {
          id: 8,
          contact_id: 216,
          custom_fields: { custom_cobertura: 'labubu' },
          tags: ['batman']
        }
      ];
      mockClient.mockGet('/custom_record_definitions/3/custom_records', mockRecords);

      const result = await handler.listCustomRecords({ definition_id: 3 });

      expect(result).toEqual(mockRecords);
      expect(mockClient.getLastCall().path).toBe('/custom_record_definitions/3/custom_records');
    });

    it('should filter by contact_id', async () => {
      const mockRecords = [{ id: 8, contact_id: 216 }];
      mockClient.mockGet(
        '/custom_record_definitions/3/custom_records?contact_id=216',
        mockRecords
      );

      const result = await handler.listCustomRecords({
        definition_id: 3,
        contact_id: 216
      });

      expect(result).toEqual(mockRecords);
      expect(mockClient.getLastCall().path).toContain('contact_id=216');
    });
  });

  describe('getCustomRecord', () => {
    it('should get a custom record', async () => {
      const mockRecord = {
        id: 8,
        contact_id: 216,
        custom_fields: { custom_cobertura: 'labubu' }
      };
      mockClient.mockGet('/custom_record_definitions/3/custom_records/8', mockRecord);

      const result = await handler.getCustomRecord({ definition_id: 3, id: 8 });

      expect(result).toEqual(mockRecord);
      expect(mockClient.getLastCall().path).toBe(
        '/custom_record_definitions/3/custom_records/8'
      );
    });
  });

  describe('createCustomRecord', () => {
    it('should create a custom record', async () => {
      const newRecord = {
        contact_id: 216,
        tags: ['batman'],
        custom_fields: { custom_cobertura: 'labubu' }
      };
      const createdRecord = { id: 8, ...newRecord };
      mockClient.mockPost('/custom_record_definitions/3/custom_records', createdRecord);

      const result = await handler.createCustomRecord({
        definition_id: 3,
        custom_record: newRecord
      });

      expect(result).toEqual(createdRecord);
      expect(mockClient.getLastCall().data).toEqual(newRecord);
    });

    it('should throw error if custom_record is missing', async () => {
      await expect(
        handler.createCustomRecord({
          definition_id: 3,
          custom_record: undefined as any
        })
      ).rejects.toThrow('Custom record data is required');
    });
  });

  describe('updateCustomRecord', () => {
    it('should update a custom record', async () => {
      const updateData = {
        custom_fields: { custom_cobertura: 'updated' }
      };
      const updatedRecord = { id: 8, ...updateData };
      mockClient.mockPut('/custom_record_definitions/3/custom_records/8', updatedRecord);

      const result = await handler.updateCustomRecord({
        definition_id: 3,
        id: 8,
        custom_record: updateData
      });

      expect(result).toEqual(updatedRecord);
      expect(mockClient.getLastCall().data).toEqual(updateData);
    });
  });

  describe('deleteCustomRecord', () => {
    it('should delete a custom record', async () => {
      mockClient.mockDelete('/custom_record_definitions/3/custom_records/8', undefined);

      await handler.deleteCustomRecord({ definition_id: 3, id: 8 });

      expect(mockClient.getLastCall().path).toBe(
        '/custom_record_definitions/3/custom_records/8'
      );
    });
  });
});