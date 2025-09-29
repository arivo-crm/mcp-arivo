import { AttachmentFilesHandler } from '../attachment-files';
import { MockArivoApiClient } from '../../__tests__/utils/mock-api-client';

describe('AttachmentFilesHandler', () => {
  let handler: AttachmentFilesHandler;
  let mockClient: MockArivoApiClient;

  beforeEach(() => {
    mockClient = new MockArivoApiClient() as any;
    handler = new AttachmentFilesHandler(mockClient as any);
  });

  afterEach(() => {
    mockClient.reset();
  });

  describe('listAttachmentFiles', () => {
    it('should list attachment files without filters', async () => {
      const mockFiles = [
        {
          id: '1',
          name: 'contract.pdf',
          size: 1024000,
          download_url: 'https://example.com/file1.pdf'
        },
        {
          id: '2',
          name: 'invoice.xlsx',
          size: 512000,
          download_url: 'https://example.com/file2.xlsx'
        }
      ];
      mockClient.mockGet('/attachment_files', mockFiles);

      const result = await handler.listAttachmentFiles();

      expect(result).toEqual(mockFiles);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('GET');
      expect(lastCall.path).toBe('/attachment_files');
    });

    it('should list attachment files with pagination', async () => {
      const mockFiles = [
        {
          id: '1',
          name: 'file1.pdf',
          size: 1024000
        }
      ];
      mockClient.mockGet('/attachment_files', mockFiles);

      const result = await handler.listAttachmentFiles({ per_page: 10 });

      expect(result).toEqual(mockFiles);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by contact_id', async () => {
      const mockFiles = [
        {
          id: '1',
          name: 'contact_doc.pdf',
          contact_id: 123
        }
      ];
      mockClient.mockGet('/attachment_files', mockFiles);

      const result = await handler.listAttachmentFiles({ contact_id: 123 });

      expect(result).toEqual(mockFiles);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by deal_id', async () => {
      const mockFiles = [
        {
          id: '2',
          name: 'deal_proposal.docx',
          deal_id: 456
        }
      ];
      mockClient.mockGet('/attachment_files', mockFiles);

      const result = await handler.listAttachmentFiles({ deal_id: 456 });

      expect(result).toEqual(mockFiles);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by note_id', async () => {
      const mockFiles = [
        {
          id: '3',
          name: 'note_attachment.png',
          note_id: 789
        }
      ];
      mockClient.mockGet('/attachment_files', mockFiles);

      const result = await handler.listAttachmentFiles({ note_id: 789 });

      expect(result).toEqual(mockFiles);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by user_id', async () => {
      const mockFiles = [
        {
          id: '4',
          name: 'user_file.jpg',
          user_id: 10
        }
      ];
      mockClient.mockGet('/attachment_files', mockFiles);

      const result = await handler.listAttachmentFiles({ user_id: 10 });

      expect(result).toEqual(mockFiles);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by team_id', async () => {
      const mockFiles = [
        {
          id: '5',
          name: 'team_report.pdf',
          team_id: 5
        }
      ];
      mockClient.mockGet('/attachment_files', mockFiles);

      const result = await handler.listAttachmentFiles({ team_id: 5 });

      expect(result).toEqual(mockFiles);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle sorting options', async () => {
      const mockFiles = [
        { id: '1', name: 'a.pdf', created_at: '2025-01-01' },
        { id: '2', name: 'b.pdf', created_at: '2025-01-02' }
      ];
      mockClient.mockGet('/attachment_files', mockFiles);

      const result = await handler.listAttachmentFiles({
        sort_field: 'created_at',
        sort_order: 'desc'
      });

      expect(result).toEqual(mockFiles);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle multiple filters combined', async () => {
      const mockFiles = [
        {
          id: '1',
          name: 'specific_file.pdf',
          contact_id: '123',
          user_id: '10',
          team_id: '5'
        }
      ];
      mockClient.mockGet('/attachment_files', mockFiles);

      const result = await handler.listAttachmentFiles({
        contact_id: 123,
        user_id: 10,
        team_id: 5,
        per_page: 20
      });

      expect(result).toEqual(mockFiles);
      expect(mockClient.getLastCall().method).toBe('GET');
    });
  });

  describe('getAttachmentFile', () => {
    it('should get an attachment file by id', async () => {
      const mockFile = {
        id: '123',
        object: 'attachment_file',
        name: 'contract.pdf',
        size: 2048000,
        download_url: 'https://example.com/contract.pdf',
        created_at: '2025-01-15T10:30:00Z',
        contact_id: 456,
        deal_id: undefined,
        note_id: undefined,
        user_id: 1,
        team_id: 1
      };
      mockClient.mockGet('/attachment_files/123', mockFile);

      const result = await handler.getAttachmentFile(123);

      expect(result).toEqual(mockFile);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('GET');
      expect(lastCall.path).toBe('/attachment_files/123');
    });

    it('should handle attachment file with all fields populated', async () => {
      const mockFile = {
        id: '789',
        object: 'attachment_file',
        name: 'comprehensive_doc.docx',
        size: 5120000,
        download_url: 'https://upload.arivo.com.br/uploads/789',
        sha256: 'abc123def456',
        created_at: '2025-01-20T15:45:00Z',
        updated_at: '2025-01-21T09:15:00Z',
        contact_id: 100,
        deal_id: 200,
        note_id: 300,
        user_id: 5,
        team_id: 3
      };
      mockClient.mockGet('/attachment_files/789', mockFile);

      const result = await handler.getAttachmentFile(789);

      expect(result).toEqual(mockFile);
      expect(result.contact_id).toBe(100);
      expect(result.deal_id).toBe(200);
      expect(result.note_id).toBe(300);
      expect(result.sha256).toBeDefined();
    });
  });

  describe('deleteAttachmentFile', () => {
    it('should delete an attachment file', async () => {
      mockClient.mockDelete('/attachment_files/123', undefined);

      await handler.deleteAttachmentFile(123);

      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('DELETE');
      expect(lastCall.path).toBe('/attachment_files/123');
    });

    it('should handle deleting multiple files sequentially', async () => {
      mockClient.mockDelete('/attachment_files/1', undefined);
      mockClient.mockDelete('/attachment_files/2', undefined);
      mockClient.mockDelete('/attachment_files/3', undefined);

      await handler.deleteAttachmentFile(1);
      await handler.deleteAttachmentFile(2);
      await handler.deleteAttachmentFile(3);

      const history = mockClient.getCallHistory();
      expect(history).toHaveLength(3);
      expect(history[0].path).toBe('/attachment_files/1');
      expect(history[1].path).toBe('/attachment_files/2');
      expect(history[2].path).toBe('/attachment_files/3');
    });
  });

  describe('error handling', () => {
    it('should handle errors when listing files', async () => {
      const error = new Error('Network error');
      mockClient.mockError('GET', '/attachment_files', error);

      await expect(handler.listAttachmentFiles()).rejects.toThrow('Network error');
    });

    it('should handle errors when getting a file', async () => {
      const error = new Error('Not found');
      mockClient.mockError('GET', '/attachment_files/999', error);

      await expect(handler.getAttachmentFile(999)).rejects.toThrow('Not found');
    });

    it('should handle errors when deleting a file', async () => {
      const error = new Error('Unauthorized');
      mockClient.mockError('DELETE', '/attachment_files/123', error);

      await expect(handler.deleteAttachmentFile(123)).rejects.toThrow('Unauthorized');
    });
  });

  describe('edge cases', () => {
    it('should handle empty list response', async () => {
      mockClient.mockGet('/attachment_files', []);

      const result = await handler.listAttachmentFiles();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle attachment file with minimal fields', async () => {
      const mockFile = {
        id: '1',
        name: 'minimal.txt',
        size: 100
      };
      mockClient.mockGet('/attachment_files/1', mockFile);

      const result = await handler.getAttachmentFile(1);

      expect(result.id).toBe('1');
      expect(result.name).toBe('minimal.txt');
      expect(result.size).toBe(100);
    });

    it('should handle large file sizes', async () => {
      const mockFile = {
        id: '1',
        name: 'large_video.mp4',
        size: 1073741824, // 1GB
        content_type: 'video/mp4'
      };
      mockClient.mockGet('/attachment_files/1', mockFile);

      const result = await handler.getAttachmentFile(1);

      expect(result.size).toBe(1073741824);
    });

    it('should handle special characters in filenames', async () => {
      const mockFile = {
        id: '1',
        name: 'файл с русскими буквами.pdf',
        size: 500000
      };
      mockClient.mockGet('/attachment_files/1', mockFile);

      const result = await handler.getAttachmentFile(1);

      expect(result.name).toBe('файл с русскими буквами.pdf');
    });

    it('should handle files with SHA256 checksums', async () => {
      const checksums = [
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
        '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1'
      ];

      for (const [index, sha256] of checksums.entries()) {
        const mockFile = {
          id: String(index + 1),
          name: `file${index + 1}.bin`,
          sha256: sha256,
          size: 1000
        };
        mockClient.mockGet(`/attachment_files/${index + 1}`, mockFile);

        const result = await handler.getAttachmentFile(index + 1);
        expect(result.sha256).toBe(sha256);
      }
    });
  });
});