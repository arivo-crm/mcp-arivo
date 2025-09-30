import { NotesHandler } from '../notes';
import { MockArivoApiClient } from '../../__tests__/utils/mock-api-client';

describe('NotesHandler', () => {
  let handler: NotesHandler;
  let mockClient: MockArivoApiClient;

  beforeEach(() => {
    mockClient = new MockArivoApiClient() as any;
    handler = new NotesHandler(mockClient as any);
  });

  afterEach(() => {
    mockClient.reset();
  });

  describe('listNotes', () => {
    it('should list notes without filters', async () => {
      const mockNotes = [
        { id: 1, text: 'First note', created_at: '2025-01-15T10:00:00Z' },
        { id: 2, text: 'Second note', created_at: '2025-01-16T11:00:00Z' }
      ];
      mockClient.mockGet('/notes', mockNotes);

      const result = await handler.listNotes();

      expect(result).toEqual(mockNotes);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('GET');
      expect(lastCall.path).toBe('/notes');
    });

    it('should list notes with pagination', async () => {
      const mockNotes = [{ id: 1, text: 'Note 1' }];
      mockClient.mockGet('/notes', mockNotes);

      const result = await handler.listNotes({ limit: 10, offset: 5 });

      expect(result).toEqual(mockNotes);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by contact_id', async () => {
      const mockNotes = [
        { id: 1, text: 'Contact note', contact_id: 100 }
      ];
      mockClient.mockGet('/notes', mockNotes);

      const result = await handler.listNotes({ contact_id: 100 });

      expect(result).toEqual(mockNotes);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by deal_id', async () => {
      const mockNotes = [
        { id: 2, text: 'Deal note', deal_id: 200 }
      ];
      mockClient.mockGet('/notes', mockNotes);

      const result = await handler.listNotes({ deal_id: 200 });

      expect(result).toEqual(mockNotes);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by task_id', async () => {
      const mockNotes = [
        { id: 3, text: 'Task note', task_id: 300 }
      ];
      mockClient.mockGet('/notes', mockNotes);

      const result = await handler.listNotes({ task_id: 300 });

      expect(result).toEqual(mockNotes);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by user_id', async () => {
      const mockNotes = [
        { id: 4, text: 'User note', user_id: 10 }
      ];
      mockClient.mockGet('/notes', mockNotes);

      const result = await handler.listNotes({ user_id: 10 });

      expect(result).toEqual(mockNotes);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by team_id', async () => {
      const mockNotes = [
        { id: 5, text: 'Team note', team_id: 5 }
      ];
      mockClient.mockGet('/notes', mockNotes);

      const result = await handler.listNotes({ team_id: 5 });

      expect(result).toEqual(mockNotes);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle search parameter', async () => {
      const mockNotes = [
        { id: 1, text: 'Important meeting notes' }
      ];
      mockClient.mockGet('/notes', mockNotes);

      const result = await handler.listNotes({ search: 'meeting' });

      expect(result).toEqual(mockNotes);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle sorting options', async () => {
      const mockNotes = [
        { id: 1, text: 'Note A', created_at: '2025-01-01T10:00:00Z' },
        { id: 2, text: 'Note B', created_at: '2025-01-02T10:00:00Z' }
      ];
      mockClient.mockGet('/notes', mockNotes);

      const result = await handler.listNotes({
        sort_field: 'created_at',
        sort_order: 'desc'
      });

      expect(result).toEqual(mockNotes);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle multiple filters combined', async () => {
      const mockNotes = [
        {
          id: 1,
          text: 'Complex note',
          contact_id: 100,
          deal_id: 200,
          user_id: 10,
          team_id: 5
        }
      ];
      mockClient.mockGet('/notes', mockNotes);

      const result = await handler.listNotes({
        contact_id: 100,
        deal_id: 200,
        user_id: 10,
        team_id: 5,
        limit: 20
      });

      expect(result).toEqual(mockNotes);
      expect(mockClient.getLastCall().method).toBe('GET');
    });
  });

  describe('getNote', () => {
    it('should get a note by id', async () => {
      const mockNote = {
        id: 123,
        object: 'note',
        text: 'This is an important note about the client meeting.',
        contact_id: 100,
        deal_id: 200,
        user_id: 5,
        team_id: 2,
        created_at: '2025-01-15T10:30:00Z',
        updated_at: '2025-01-15T10:30:00Z'
      };
      mockClient.mockGet('/notes/123', mockNote);

      const result = await handler.getNote({ id: 123 });

      expect(result).toEqual(mockNote);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('GET');
      expect(lastCall.path).toBe('/notes/123');
    });

    it('should handle note with minimal fields', async () => {
      const mockNote = {
        id: 456,
        text: 'Simple note'
      };
      mockClient.mockGet('/notes/456', mockNote);

      const result = await handler.getNote({ id: 456 });

      expect(result.id).toBe(456);
      expect(result.text).toBe('Simple note');
    });

    it('should handle note with all associations', async () => {
      const mockNote = {
        id: 789,
        text: 'Comprehensive note',
        contact_id: 100,
        deal_id: 200,
        task_id: 300,
        user_id: 10,
        team_id: 5
      };
      mockClient.mockGet('/notes/789', mockNote);

      const result = await handler.getNote({ id: 789 });

      expect(result.contact_id).toBe(100);
      expect(result.deal_id).toBe(200);
      expect(result.task_id).toBe(300);
      expect(result.user_id).toBe(10);
      expect(result.team_id).toBe(5);
    });

    it('should throw error if id is missing', async () => {
      await expect(
        handler.getNote({ id: undefined as any })
      ).rejects.toThrow('Note ID is required');
    });
  });

  describe('createNote', () => {
    it('should create a note with basic text', async () => {
      const newNote = {
        text: 'This is a new note'
      };
      const createdNote = {
        id: 123,
        ...newNote,
        created_at: '2025-01-20T14:30:00Z'
      };
      mockClient.mockPost('/notes', createdNote);

      const result = await handler.createNote({ note: newNote });

      expect(result).toEqual(createdNote);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('POST');
      expect(lastCall.path).toBe('/notes');
      expect(lastCall.data).toEqual(newNote);
    });

    it('should create note associated with contact', async () => {
      const newNote = {
        text: 'Note about contact',
        contact_id: 100
      };
      const createdNote = { id: 456, ...newNote };
      mockClient.mockPost('/notes', createdNote);

      const result = await handler.createNote({ note: newNote });

      expect(result.contact_id).toBe(100);
      expect(mockClient.getLastCall().data).toEqual(newNote);
    });

    it('should create note associated with deal', async () => {
      const newNote = {
        text: 'Deal progress update',
        deal_id: 200
      };
      const createdNote = { id: 789, ...newNote };
      mockClient.mockPost('/notes', createdNote);

      const result = await handler.createNote({ note: newNote });

      expect(result.deal_id).toBe(200);
      expect(mockClient.getLastCall().data).toEqual(newNote);
    });

    it('should create note with user and team assignment', async () => {
      const newNote = {
        text: 'Team note',
        user_id: 10,
        team_id: 5
      };
      const createdNote = { id: 111, ...newNote };
      mockClient.mockPost('/notes', createdNote);

      const result = await handler.createNote({ note: newNote });

      expect(result.user_id).toBe(10);
      expect(result.team_id).toBe(5);
    });

    it('should create note with multiple associations', async () => {
      const newNote = {
        text: 'Comprehensive note with all associations',
        contact_id: 100,
        deal_id: 200,
        user_id: 10,
        team_id: 5
      };
      const createdNote = { id: 222, ...newNote };
      mockClient.mockPost('/notes', createdNote);

      const result = await handler.createNote({ note: newNote });

      expect(result.contact_id).toBe(100);
      expect(result.deal_id).toBe(200);
      expect(result.user_id).toBe(10);
      expect(result.team_id).toBe(5);
    });

    it('should create note with long text', async () => {
      const longText = 'Lorem ipsum dolor sit amet, '.repeat(50);
      const newNote = { text: longText };
      const createdNote = { id: 333, ...newNote };
      mockClient.mockPost('/notes', createdNote);

      const result = await handler.createNote({ note: newNote });

      expect(result.text).toBe(longText);
    });

    it('should throw error if text is missing', async () => {
      await expect(
        handler.createNote({ note: {} as any })
      ).rejects.toThrow('Note text is required');
    });

    it('should throw error if note object is missing', async () => {
      await expect(
        handler.createNote({ note: undefined as any })
      ).rejects.toThrow('Note text is required');
    });
  });

  describe('updateNote', () => {
    it('should update a note text', async () => {
      const updateData = { text: 'Updated note text' };
      const updatedNote = {
        id: 123,
        text: 'Updated note text',
        updated_at: '2025-01-20T15:00:00Z'
      };
      mockClient.mockPut('/notes/123', updatedNote);

      const result = await handler.updateNote({ id: 123, note: updateData });

      expect(result).toEqual(updatedNote);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('PUT');
      expect(lastCall.path).toBe('/notes/123');
      expect(lastCall.data).toEqual(updateData);
    });

    it('should update note associations', async () => {
      const updateData = {
        contact_id: 150,
        deal_id: 250
      };
      const updatedNote = {
        id: 456,
        text: 'Note',
        ...updateData
      };
      mockClient.mockPut('/notes/456', updatedNote);

      const result = await handler.updateNote({ id: 456, note: updateData });

      expect(result.contact_id).toBe(150);
      expect(result.deal_id).toBe(250);
    });

    it('should update note user and team assignment', async () => {
      const updateData = {
        user_id: 20,
        team_id: 10
      };
      const updatedNote = {
        id: 789,
        text: 'Note',
        ...updateData
      };
      mockClient.mockPut('/notes/789', updatedNote);

      const result = await handler.updateNote({ id: 789, note: updateData });

      expect(result.user_id).toBe(20);
      expect(result.team_id).toBe(10);
    });

    it('should update note with all fields', async () => {
      const updateData = {
        text: 'Completely updated note',
        contact_id: 100,
        deal_id: 200,
        user_id: 15,
        team_id: 7
      };
      const updatedNote = { id: 111, ...updateData };
      mockClient.mockPut('/notes/111', updatedNote);

      const result = await handler.updateNote({ id: 111, note: updateData });

      expect(result.text).toBe('Completely updated note');
      expect(result.contact_id).toBe(100);
      expect(result.deal_id).toBe(200);
    });

    it('should throw error if id is missing', async () => {
      await expect(
        handler.updateNote({ id: undefined as any, note: { text: 'Test' } })
      ).rejects.toThrow('Note ID is required');
    });

    it('should throw error if note data is missing', async () => {
      await expect(
        handler.updateNote({ id: 123, note: undefined as any })
      ).rejects.toThrow('Note data is required');
    });
  });

  describe('deleteNote', () => {
    it('should delete a note', async () => {
      mockClient.mockDelete('/notes/123', undefined);

      const result = await handler.deleteNote({ id: 123 });

      expect(result).toEqual({ success: true });
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('DELETE');
      expect(lastCall.path).toBe('/notes/123');
    });

    it('should handle deleting multiple notes sequentially', async () => {
      mockClient.mockDelete('/notes/1', undefined);
      mockClient.mockDelete('/notes/2', undefined);
      mockClient.mockDelete('/notes/3', undefined);

      await handler.deleteNote({ id: 1 });
      await handler.deleteNote({ id: 2 });
      await handler.deleteNote({ id: 3 });

      const history = mockClient.getCallHistory();
      expect(history).toHaveLength(3);
      expect(history[0].path).toBe('/notes/1');
      expect(history[1].path).toBe('/notes/2');
      expect(history[2].path).toBe('/notes/3');
    });

    it('should throw error if id is missing', async () => {
      await expect(
        handler.deleteNote({ id: undefined as any })
      ).rejects.toThrow('Note ID is required');
    });
  });

  describe('error handling', () => {
    it('should handle errors when listing notes', async () => {
      const error = new Error('Network error');
      mockClient.mockError('GET', '/notes', error);

      await expect(handler.listNotes()).rejects.toThrow('Network error');
    });

    it('should handle errors when getting a note', async () => {
      const error = new Error('Not found');
      mockClient.mockError('GET', '/notes/999', error);

      await expect(handler.getNote({ id: 999 })).rejects.toThrow('Not found');
    });

    it('should handle errors when creating a note', async () => {
      const error = new Error('Validation error');
      mockClient.mockError('POST', '/notes', error);

      await expect(
        handler.createNote({ note: { text: 'Test note' } })
      ).rejects.toThrow('Validation error');
    });

    it('should handle errors when updating a note', async () => {
      const error = new Error('Unauthorized');
      mockClient.mockError('PUT', '/notes/123', error);

      await expect(
        handler.updateNote({ id: 123, note: { text: 'Updated' } })
      ).rejects.toThrow('Unauthorized');
    });

    it('should handle errors when deleting a note', async () => {
      const error = new Error('Forbidden');
      mockClient.mockError('DELETE', '/notes/123', error);

      await expect(handler.deleteNote({ id: 123 })).rejects.toThrow('Forbidden');
    });
  });

  describe('edge cases', () => {
    it('should handle empty list response', async () => {
      mockClient.mockGet('/notes', []);

      const result = await handler.listNotes();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle note with very short text', async () => {
      const mockNote = { id: 1, text: 'ok' };
      mockClient.mockGet('/notes/1', mockNote);

      const result = await handler.getNote({ id: 1 });

      expect(result.text).toBe('ok');
    });

    it('should handle note with very long text', async () => {
      const longText = 'A'.repeat(10000);
      const mockNote = { id: 1, text: longText };
      mockClient.mockGet('/notes/1', mockNote);

      const result = await handler.getNote({ id: 1 });

      expect(result.text.length).toBe(10000);
    });

    it('should handle note with special characters', async () => {
      const mockNote = {
        id: 1,
        text: 'Note with special chars: @#$%^&*()_+-={}[]|\\:";\'<>?,./'
      };
      mockClient.mockGet('/notes/1', mockNote);

      const result = await handler.getNote({ id: 1 });

      expect(result.text).toContain('@#$%^&*()');
    });

    it('should handle note with unicode characters', async () => {
      const mockNote = {
        id: 1,
        text: 'Nota em português 中文笔记 Заметка на русском 📝✅'
      };
      mockClient.mockGet('/notes/1', mockNote);

      const result = await handler.getNote({ id: 1 });

      expect(result.text).toContain('português');
      expect(result.text).toContain('中文');
      expect(result.text).toContain('📝');
    });

    it('should handle note with newlines', async () => {
      const mockNote = {
        id: 1,
        text: 'Line 1\nLine 2\nLine 3'
      };
      mockClient.mockGet('/notes/1', mockNote);

      const result = await handler.getNote({ id: 1 });

      expect(result.text).toContain('\n');
    });

    it('should handle note with HTML-like content', async () => {
      const mockNote = {
        id: 1,
        text: '<strong>Important:</strong> Review the <a href="#">proposal</a>'
      };
      mockClient.mockGet('/notes/1', mockNote);

      const result = await handler.getNote({ id: 1 });

      expect(result.text).toContain('<strong>');
    });

    it('should handle list with many notes', async () => {
      const mockNotes = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        text: `Note ${i + 1}`
      }));
      mockClient.mockGet('/notes', mockNotes);

      const result = await handler.listNotes();

      expect(result).toHaveLength(100);
    });
  });

  describe('real-world scenarios', () => {
    it('should handle note creation for contact follow-up', async () => {
      const newNote = {
        text: 'Called client - interested in premium package. Follow up next week.',
        contact_id: 100,
        user_id: 5
      };
      const createdNote = {
        id: 999,
        ...newNote,
        created_at: '2025-01-20T10:00:00Z'
      };
      mockClient.mockPost('/notes', createdNote);

      const result = await handler.createNote({ note: newNote });

      expect(result.contact_id).toBe(100);
      expect(result.text).toContain('Follow up');
    });

    it('should handle note creation for deal update', async () => {
      const newNote = {
        text: 'Client approved the proposal. Moving to contract phase.',
        deal_id: 200,
        user_id: 5,
        team_id: 2
      };
      const createdNote = { id: 888, ...newNote };
      mockClient.mockPost('/notes', createdNote);

      const result = await handler.createNote({ note: newNote });

      expect(result.deal_id).toBe(200);
      expect(result.text).toContain('contract phase');
    });

    it('should handle note update after meeting', async () => {
      const originalNote = {
        id: 777,
        text: 'Scheduled meeting with client',
        contact_id: 100,
        deal_id: 200
      };
      mockClient.mockGet('/notes/777', originalNote);

      const updatedText = {
        text: 'Scheduled meeting with client\n\nUPDATE: Meeting completed. Client agreed to terms.'
      };
      const updatedNote = { ...originalNote, ...updatedText };
      mockClient.mockPut('/notes/777', updatedNote);

      const result = await handler.updateNote({ id: 777, note: updatedText });

      expect(result.text).toContain('Meeting completed');
    });

    it('should handle listing notes for a specific contact', async () => {
      const mockNotes = [
        {
          id: 1,
          text: 'First contact with client',
          contact_id: 100,
          created_at: '2025-01-10T10:00:00Z'
        },
        {
          id: 2,
          text: 'Follow-up call',
          contact_id: 100,
          created_at: '2025-01-15T14:00:00Z'
        },
        {
          id: 3,
          text: 'Meeting scheduled',
          contact_id: 100,
          created_at: '2025-01-20T09:00:00Z'
        }
      ];
      mockClient.mockGet('/notes', mockNotes);

      const result = await handler.listNotes({ contact_id: 100 });

      expect(result).toHaveLength(3);
      expect(result.every(note => note.contact_id === 100)).toBe(true);
    });

    it('should handle listing notes for a specific deal', async () => {
      const mockNotes = [
        {
          id: 10,
          text: 'Initial proposal sent',
          deal_id: 200,
          created_at: '2025-01-05T10:00:00Z'
        },
        {
          id: 11,
          text: 'Client requested changes',
          deal_id: 200,
          created_at: '2025-01-12T11:00:00Z'
        },
        {
          id: 12,
          text: 'Revised proposal approved',
          deal_id: 200,
          created_at: '2025-01-18T15:00:00Z'
        }
      ];
      mockClient.mockGet('/notes', mockNotes);

      const result = await handler.listNotes({ deal_id: 200 });

      expect(result).toHaveLength(3);
      expect(result.every(note => note.deal_id === 200)).toBe(true);
    });

    it('should handle note with meeting minutes', async () => {
      const meetingNote = {
        text: `Meeting Minutes - Q1 Planning
Date: 2025-01-20
Attendees: John, Mary, Peter

Key Points:
- Budget approved for new campaign
- Launch date set for Feb 15
- Next meeting: Jan 27

Action Items:
- John: Prepare marketing materials
- Mary: Coordinate with design team
- Peter: Set up analytics tracking`
      };
      const createdNote = {
        id: 666,
        ...meetingNote,
        deal_id: 300,
        team_id: 5
      };
      mockClient.mockPost('/notes', createdNote);

      const result = await handler.createNote({ note: meetingNote });

      expect(result.text).toContain('Meeting Minutes');
      expect(result.text).toContain('Action Items');
    });
  });
});