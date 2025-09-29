import { ArivoApiClient } from '../http';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ArivoApiClient', () => {
  let client: ArivoApiClient;
  const mockConfig = {
    apiKey: 'test-api-key',
    apiUrl: 'https://api.test.com'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    } as any);
    client = new ArivoApiClient(mockConfig);
  });

  describe('constructor', () => {
    it('should create axios instance with correct config', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: mockConfig.apiUrl,
        headers: {
          'Authorization': `Token token=${mockConfig.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
    });
  });

  describe('error handling', () => {
    it('should handle 401 Unauthorized error', async () => {
      const mockClient = mockedAxios.create() as any;
      mockClient.get.mockRejectedValue({
        response: {
          status: 401,
          statusText: 'Unauthorized'
        }
      });

      await expect(client.get('/test')).rejects.toThrow('Unauthorized: invalid API key');
    });

    it('should handle 404 Not Found error', async () => {
      const mockClient = mockedAxios.create() as any;
      mockClient.get.mockRejectedValue({
        response: {
          status: 404,
          statusText: 'Not Found',
          data: 'Resource not found'
        }
      });

      await expect(client.get('/test')).rejects.toThrow('Not found: Resource not found');
    });

    it('should handle 422 Validation error with field errors', async () => {
      const mockClient = mockedAxios.create() as any;
      mockClient.post.mockRejectedValue({
        response: {
          status: 422,
          data: {
            errors: {
              name: ['não pode ficar em branco'],
              email: ['formato inválido']
            }
          }
        }
      });

      await expect(client.post('/test', {})).rejects.toThrow(
        'Validation error: name: não pode ficar em branco; email: formato inválido'
      );
    });

    it('should handle 422 Validation error with array errors', async () => {
      const mockClient = mockedAxios.create() as any;
      mockClient.post.mockRejectedValue({
        response: {
          status: 422,
          data: {
            errors: ['Error 1', 'Error 2']
          }
        }
      });

      await expect(client.post('/test', {})).rejects.toThrow(
        'Validation error: Error 1, Error 2'
      );
    });

    it('should handle network errors', async () => {
      const mockClient = mockedAxios.create() as any;
      mockClient.get.mockRejectedValue({
        request: {}
      });

      await expect(client.get('/test')).rejects.toThrow(
        'Arivo API error: Network error - no response received'
      );
    });

    it('should handle generic errors', async () => {
      const mockClient = mockedAxios.create() as any;
      mockClient.get.mockRejectedValue(new Error('Something went wrong'));

      await expect(client.get('/test')).rejects.toThrow(
        'Arivo API error: Something went wrong'
      );
    });

    it('should handle 500 Server error', async () => {
      const mockClient = mockedAxios.create() as any;
      mockClient.get.mockRejectedValue({
        response: {
          status: 500,
          data: 'Internal server error'
        }
      });

      await expect(client.get('/test')).rejects.toThrow(
        'Server error: Internal server error'
      );
    });
  });
});