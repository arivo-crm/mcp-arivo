import { ArivoApiClient } from '../../utils/http';

export class MockArivoApiClient {
  private mockResponses: Map<string, any> = new Map();
  private mockErrors: Map<string, Error> = new Map();
  private callHistory: Array<{ method: string; path: string; data?: any }> = [];

  mockGet(path: string, response: any) {
    this.mockResponses.set(`GET:${path}`, response);
  }

  mockPost(path: string, response: any) {
    this.mockResponses.set(`POST:${path}`, response);
  }

  mockPut(path: string, response: any) {
    this.mockResponses.set(`PUT:${path}`, response);
  }

  mockDelete(path: string, response: any) {
    this.mockResponses.set(`DELETE:${path}`, response);
  }

  mockError(method: string, path: string, error: Error) {
    this.mockErrors.set(`${method}:${path}`, error);
  }

  async get<T>(path: string): Promise<T> {
    this.callHistory.push({ method: 'GET', path });

    const errorKey = `GET:${path}`;
    if (this.mockErrors.has(errorKey)) {
      throw this.mockErrors.get(errorKey);
    }

    // Try exact match first
    const exactKey = `GET:${path}`;
    if (this.mockResponses.has(exactKey)) {
      return this.mockResponses.get(exactKey);
    }

    // Try to match base path without query params
    const basePath = path.split('?')[0];
    const baseKey = `GET:${basePath}`;
    if (this.mockResponses.has(baseKey)) {
      return this.mockResponses.get(baseKey);
    }

    throw new Error(`No mock response for GET ${path}`);
  }

  async post<T>(path: string, data?: any): Promise<T> {
    this.callHistory.push({ method: 'POST', path, data });

    const errorKey = `POST:${path}`;
    if (this.mockErrors.has(errorKey)) {
      throw this.mockErrors.get(errorKey);
    }

    const key = `POST:${path}`;
    if (this.mockResponses.has(key)) {
      return this.mockResponses.get(key);
    }
    throw new Error(`No mock response for POST ${path}`);
  }

  async put<T>(path: string, data?: any): Promise<T> {
    this.callHistory.push({ method: 'PUT', path, data });

    const errorKey = `PUT:${path}`;
    if (this.mockErrors.has(errorKey)) {
      throw this.mockErrors.get(errorKey);
    }

    const key = `PUT:${path}`;
    if (this.mockResponses.has(key)) {
      return this.mockResponses.get(key);
    }
    throw new Error(`No mock response for PUT ${path}`);
  }

  async delete<T>(path: string): Promise<T> {
    this.callHistory.push({ method: 'DELETE', path });

    const errorKey = `DELETE:${path}`;
    if (this.mockErrors.has(errorKey)) {
      throw this.mockErrors.get(errorKey);
    }

    const key = `DELETE:${path}`;
    if (this.mockResponses.has(key)) {
      return this.mockResponses.get(key);
    }
    throw new Error(`No mock response for DELETE ${path}`);
  }

  getCallHistory() {
    return this.callHistory;
  }

  getLastCall() {
    return this.callHistory[this.callHistory.length - 1];
  }

  clearHistory() {
    this.callHistory = [];
  }

  reset() {
    this.mockResponses.clear();
    this.mockErrors.clear();
    this.callHistory = [];
  }
}

export function createMockApiClient(): ArivoApiClient {
  return new MockArivoApiClient() as unknown as ArivoApiClient;
}