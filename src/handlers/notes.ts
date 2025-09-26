import { ArivoApiClient } from '../utils/http';

export interface Note {
  id?: number;
  text: string;
  contact_id?: number;
  deal_id?: number;
  task_id?: number;
  team_id?: number;
  user_id?: number;
  object?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export class NotesHandler {
  constructor(private apiClient: ArivoApiClient) {}

  async listNotes(args: any = {}): Promise<Note[]> {
    const params: Record<string, any> = {};

    if (args.limit) params.per_page = args.limit;
    if (args.offset) params.offset = args.offset;
    if (args.contact_id) params.contact_id = args.contact_id;
    if (args.deal_id) params.deal_id = args.deal_id;
    if (args.task_id) params.task_id = args.task_id;
    if (args.user_id) params.user_id = args.user_id;
    if (args.team_id) params.team_id = args.team_id;
    if (args.search) params.search = args.search;
    if (args.sort_field) params.sort_field = args.sort_field;
    if (args.sort_order) params.sort_order = args.sort_order;

    return await this.apiClient.get<Note[]>('/notes', params);
  }

  async getNote(args: { id: number }): Promise<Note> {
    if (!args.id) {
      throw new Error('Note ID is required');
    }
    return await this.apiClient.get<Note>(`/notes/${args.id}`);
  }

  async createNote(args: { note: Partial<Note> }): Promise<Note> {
    if (!args.note || !args.note.text) {
      throw new Error('Note text is required');
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
        task_id: { type: 'number', description: 'Filter by task ID' },
        user_id: { type: 'number', description: 'Filter by user ID' },
        team_id: { type: 'number', description: 'Filter by team ID' },
        search: { type: 'string', description: 'Search term to filter notes' },
        sort_field: { type: 'string', description: 'Field to sort by (created_at, updated_at)' },
        sort_order: { type: 'string', description: 'Sort order (asc, desc)' }
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
            text: { type: 'string', description: 'Note content' },
            contact_id: { type: 'number', description: 'Associated contact ID' },
            deal_id: { type: 'number', description: 'Associated deal ID' }
          },
          required: ['text']
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
            text: { type: 'string', description: 'Note content' },
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