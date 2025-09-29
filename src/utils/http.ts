import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Config } from '../config';

export class ArivoApiClient {
  private client: AxiosInstance;

  constructor(config: Config) {
    this.client = axios.create({
      baseURL: config.apiUrl,
      headers: {
        'Authorization': `Token token=${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async get<T = any>(path: string, params?: Record<string, any>): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.get(path, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async post<T = any>(path: string, data?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.post(path, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async put<T = any>(path: string, data?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.put(path, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete<T = any>(path: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.delete(path);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (error.response) {
      const status = error.response.status;
      const responseData = error.response.data;

      // Extract meaningful error message
      let message = error.response.statusText || 'Unknown error';

      if (responseData) {
        if (typeof responseData === 'string') {
          message = responseData;
        } else if (responseData.message) {
          message = responseData.message;
        } else if (responseData.error) {
          message = responseData.error;
        } else if (responseData.errors) {
          // Handle validation errors properly
          if (Array.isArray(responseData.errors)) {
            message = responseData.errors.join(', ');
          } else if (typeof responseData.errors === 'object' && responseData.errors !== null) {
            // Convert object errors to readable format
            const errorMessages = Object.entries(responseData.errors)
              .map(([field, fieldErrors]) => {
                if (Array.isArray(fieldErrors)) {
                  return `${field}: ${fieldErrors.join(', ')}`;
                } else {
                  return `${field}: ${String(fieldErrors)}`;
                }
              })
              .join('; ');
            message = errorMessages || 'Validation errors occurred';
          } else {
            message = String(responseData.errors);
          }
        } else {
          // Fallback: stringify the entire response data
          try {
            message = JSON.stringify(responseData, null, 2);
          } catch {
            message = String(responseData);
          }
        }
      }

      // Ensure message is always a string and never [object Object]
      if (typeof message !== 'string') {
        try {
          message = JSON.stringify(message);
        } catch {
          message = 'Error occurred but could not parse error details';
        }
      }

      switch (status) {
        case 401:
          throw new Error(`Unauthorized: invalid API key`);
        case 404:
          throw new Error(`Not found: ${message}`);
        case 422:
          throw new Error(`Validation error: ${message}`);
        case 400:
          throw new Error(`Bad request: ${message}`);
        case 403:
          throw new Error(`Forbidden: ${message}`);
        case 500:
          throw new Error(`Server error: ${message}`);
        default:
          throw new Error(`Arivo API error (${status}): ${message}`);
      }
    } else if (error.request) {
      throw new Error(`Arivo API error: Network error - no response received`);
    } else {
      throw new Error(`Arivo API error: ${error.message}`);
    }
  }
}