import { ArivoApiClient } from '../utils/http';

export interface Note {
  id?: number;
  content: string;
  contact_id?: number;
  deal_id?: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export class NotesHandler {
  constructor(private apiClient: ArivoApiClient) {}

  async listNotes(args: any = {}): Promise<Note[]> {
    const params: Record<string, any> = {};

    if (args.limit) params.limit = args.limit;
    if (args.offset) params.offset = args.offset;
    if (args.contact_id) params.contact_id = args.contact_id;
    if (args.deal_id) params.deal_id = args.deal_id;
    if (args.search) params.search = args.search;

    return await this.apiClient.get<Note[]>('/notes', params);
  }

  async getNote(args: { id: number }): Promise<Note> {
    if (!args.id) {
      throw new Error('Note ID is required');
    }
    return await this.apiClient.get<Note>(`/notes/${args.id}`);
  }

  async createNote(args: { note: Partial<Note> }): Promise<Note> {
    if (!args.note || !args.note.content) {
      throw new Error('Note content is required');
    }
    return await this.apiClient.post<Note>('/notes', args.note);
  }

  async updateNote(args: { id: number; note: Partial<Note> }): Promise<Note> {
    if (!args.id) {
      throw new Error('Note ID is required');
    }
    if (!args.note) {
      throw new Error('Note data is required');
    }
    return await this.apiClient.put<Note>(`/notes/${args.id}`, args.note);
  }

  async deleteNote(args: { id: number }): Promise<{ success: boolean }> {
    if (!args.id) {
      throw new Error('Note ID is required');
    }
    await this.apiClient.delete(`/notes/${args.id}`);
    return { success: true };
  }
}

export const notesToolDefinitions = [
  {
    name: 'list_notes',
    description: 'List all notes with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum number of notes to return' },
        offset: { type: 'number', description: 'Number of notes to skip' },
        contact_id: { type: 'number', description: 'Filter by contact ID' },
        deal_id: { type: 'number', description: 'Filter by deal ID' },
        search: { type: 'string', description: 'Search term to filter notes' }
      }
    }
  },
  {
    name: 'get_note',
    description: 'Get a specific note by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Note ID' }
      },
      required: ['id']
    }
  },
  {
    name: 'create_note',
    description: 'Create a new note',
    inputSchema: {
      type: 'object',
      properties: {
        note: {
          type: 'object',
          properties: {
            content: { type: 'string', description: 'Note content' },
            contact_id: { type: 'number', description: 'Associated contact ID' },
            deal_id: { type: 'number', description: 'Associated deal ID' }
          },
          required: ['content']
        }
      },
      required: ['note']
    }
  },
  {
    name: 'update_note',
    description: 'Update an existing note',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Note ID' },
        note: {
          type: 'object',
          properties: {
            content: { type: 'string', description: 'Note content' },
            contact_id: { type: 'number', description: 'Associated contact ID' },
            deal_id: { type: 'number', description: 'Associated deal ID' }
          }
        }
      },
      required: ['id', 'note']
    }
  },
  {
    name: 'delete_note',
    description: 'Delete a note',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Note ID' }
      },
      required: ['id']
    }
  }
];