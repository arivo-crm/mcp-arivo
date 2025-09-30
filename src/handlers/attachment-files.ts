import { ArivoApiClient } from '../utils/http';

export interface AttachmentFile {
  id?: string;
  object?: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  size?: number;
  sha256?: string;
  download_url?: string;
  contact_id?: number;
  deal_id?: number;
  note_id?: number;
  team_id?: number;
  user_id?: number;
}

export interface ListAttachmentFilesParams {
  per_page?: number;
  sort_field?: 'name' | 'size' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
  contact_id?: number;
  deal_id?: number;
  note_id?: number;
  user_id?: number;
  team_id?: number;
}

export const attachmentFilesToolDefinitions = [
  {
    name: 'list_attachment_files',
    description: 'List all attachment files with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        per_page: {
          type: 'number',
          description: 'Maximum number of attachment files to return',
        },
        sort_field: {
          type: 'string',
          description: 'Field to sort by (name, size, created_at, updated_at)',
        },
        sort_order: {
          type: 'string',
          description: 'Sort order (asc, desc)',
        },
        contact_id: {
          type: 'number',
          description: 'Filter by contact ID',
        },
        deal_id: {
          type: 'number',
          description: 'Filter by deal ID',
        },
        note_id: {
          type: 'number',
          description: 'Filter by note ID',
        },
        user_id: {
          type: 'number',
          description: 'Filter by user ID',
        },
        team_id: {
          type: 'number',
          description: 'Filter by team ID',
        },
      },
    },
  },
  {
    name: 'get_attachment_file',
    description: 'Get a specific attachment file by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Attachment file ID',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'delete_attachment_file',
    description: 'Delete an attachment file',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Attachment file ID',
        },
      },
      required: ['id'],
    },
  },
];

export class AttachmentFilesHandler {
  constructor(private apiClient: ArivoApiClient) {}

  async listAttachmentFiles(params: ListAttachmentFilesParams = {}): Promise<AttachmentFile[]> {
    const queryParams = new URLSearchParams();

    if (params.per_page !== undefined) queryParams.append('per_page', params.per_page.toString());
    if (params.sort_field) queryParams.append('sort_field', params.sort_field);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);
    if (params.contact_id !== undefined) queryParams.append('contact_id', params.contact_id.toString());
    if (params.deal_id !== undefined) queryParams.append('deal_id', params.deal_id.toString());
    if (params.note_id !== undefined) queryParams.append('note_id', params.note_id.toString());
    if (params.user_id !== undefined) queryParams.append('user_id', params.user_id.toString());
    if (params.team_id !== undefined) queryParams.append('team_id', params.team_id.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/attachment_files?${queryString}` : '/attachment_files';

    return await this.apiClient.get<AttachmentFile[]>(endpoint);
  }

  async getAttachmentFile(id: number): Promise<AttachmentFile> {
    return await this.apiClient.get<AttachmentFile>(`/attachment_files/${id}`);
  }

  async deleteAttachmentFile(id: number): Promise<void> {
    await this.apiClient.delete(`/attachment_files/${id}`);
  }
}