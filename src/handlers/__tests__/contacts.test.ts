import { ContactsHandler } from '../contacts';
import { MockArivoApiClient } from '../../__tests__/utils/mock-api-client';

describe('ContactsHandler', () => {
  let handler: ContactsHandler;
  let mockClient: MockArivoApiClient;

  beforeEach(() => {
    mockClient = new MockArivoApiClient() as any;
    handler = new ContactsHandler(mockClient as any);
  });

  afterEach(() => {
    mockClient.reset();
  });

  describe('listContacts', () => {
    it('should list contacts without filters', async () => {
      const mockContacts = [
        { id: '1', name: 'John Doe', contact_type: 'person' },
        { id: '2', name: 'Jane Smith', contact_type: 'person' }
      ];
      mockClient.mockGet('/contacts', mockContacts);

      const result = await handler.listContacts();

      expect(result).toEqual(mockContacts);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('GET');
      expect(lastCall.path).toBe('/contacts');
    });

    it('should list contacts with filters', async () => {
      const mockContacts = [{ id: '1', name: 'John Doe', contact_type: 'person' }];
      mockClient.mockGet('/contacts', mockContacts);

      const result = await handler.listContacts({ limit: 10, name: 'John' });

      expect(result).toEqual(mockContacts);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('GET');
      expect(lastCall.path).toBe('/contacts');
    });

    it('should handle contact_type filter', async () => {
      const mockContacts = [{ id: '1', name: 'ACME Corp', contact_type: 'company' }];
      mockClient.mockGet('/contacts', mockContacts);

      const result = await handler.listContacts({ contact_type: 'company' });

      expect(result).toEqual(mockContacts);
      expect(mockClient.getLastCall().method).toBe('GET');
      expect(mockClient.getLastCall().path).toBe('/contacts');
    });
  });

  describe('getContact', () => {
    it('should get a contact by id', async () => {
      const mockContact = {
        id: '123',
        name: 'John Doe',
        contact_type: 'person',
        emails: [{ address: 'john@example.com' }]
      };
      mockClient.mockGet('/contacts/123', mockContact);

      const result = await handler.getContact({ id: 123 });

      expect(result).toEqual(mockContact);
      expect(mockClient.getLastCall().path).toBe('/contacts/123');
    });
  });

  describe('createContact', () => {
    it('should create a contact with basic info', async () => {
      const newContact = {
        name: 'John Doe',
        contact_type: 'person'
      };
      const createdContact = {
        id: '123',
        ...newContact,
        phones: [],
        emails: [],
        addresses: []
      };
      mockClient.mockPost('/contacts', createdContact);

      const result = await handler.createContact({ contact: newContact });

      expect(result).toEqual(createdContact);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('POST');
      expect(lastCall.path).toBe('/contacts');
      expect(lastCall.data).toEqual(newContact);
    });

    it('should create a contact with phones, emails, and addresses', async () => {
      const newContact = {
        name: 'John Doe',
        contact_type: 'person',
        phones: [{ number: '555-1234', phone_type: 'work' }],
        emails: [{ address: 'john@example.com', email_type: 'work' }],
        addresses: [{ street: '123 Main St', city: 'New York' }]
      };
      const createdContact = { id: '123', ...newContact };
      mockClient.mockPost('/contacts', createdContact);

      const result = await handler.createContact({ contact: newContact });

      expect(result).toEqual(createdContact);
      expect(mockClient.getLastCall().data.phones).toEqual(newContact.phones);
      expect(mockClient.getLastCall().data.emails).toEqual(newContact.emails);
      expect(mockClient.getLastCall().data.addresses).toEqual(newContact.addresses);
    });

    it('should throw error if name is missing', async () => {
      await expect(
        handler.createContact({ contact: { contact_type: 'person' } as any })
      ).rejects.toThrow('Contact name is required');
    });
  });

  describe('updateContact', () => {
    it('should update a contact', async () => {
      const updateData = { name: 'John Doe Updated' };
      const updatedContact = {
        id: '123',
        name: 'John Doe Updated',
        contact_type: 'person'
      };
      mockClient.mockPut('/contacts/123', updatedContact);

      const result = await handler.updateContact({ id: 123, contact: updateData });

      expect(result).toEqual(updatedContact);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('PUT');
      expect(lastCall.path).toBe('/contacts/123');
      expect(lastCall.data).toEqual(updateData);
    });

    it('should update contact with user_id and team_id', async () => {
      const updateData = { name: 'John Doe', user_id: 5, team_id: 2 };
      const updatedContact = { id: '123', ...updateData };
      mockClient.mockPut('/contacts/123', updatedContact);

      const result = await handler.updateContact({ id: 123, contact: updateData });

      expect(result.user_id).toBe(5);
      expect(result.team_id).toBe(2);
    });
  });

  describe('deleteContact', () => {
    it('should delete a contact', async () => {
      mockClient.mockDelete('/contacts/123', undefined);

      await handler.deleteContact({ id: 123 });

      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('DELETE');
      expect(lastCall.path).toBe('/contacts/123');
    });
  });
});