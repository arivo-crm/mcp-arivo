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
      const message = error.response.data?.message || error.response.statusText;

      switch (status) {
        case 401:
          throw new Error(`Unauthorized: invalid API key`);
        case 404:
          throw new Error(`Not found`);
        default:
          throw new Error(`Arivo API error: ${message}`);
      }
    } else if (error.request) {
      throw new Error(`Arivo API error: Network error`);
    } else {
      throw new Error(`Arivo API error: ${error.message}`);
    }
  }
}