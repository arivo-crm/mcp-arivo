import { readFileSync } from 'fs';
import { join } from 'path';

export interface Config {
  apiKey: string;
  apiUrl: string;
}

export function loadConfig(): Config {
  let apiKey = process.env.ARIVO_API_KEY;
  let apiUrl = process.env.ARIVO_API_URL || 'https://arivo.com.br/api/v2';

  // Fallback to config.json if env variable not set
  if (!apiKey) {
    try {
      const configPath = join(process.cwd(), 'config.json');
      const configFile = readFileSync(configPath, 'utf-8');
      const config = JSON.parse(configFile);
      apiKey = config.apiKey;
      if (config.apiUrl) {
        apiUrl = config.apiUrl;
      }
    } catch (error) {
      // config.json doesn't exist or is invalid
    }
  }

  if (!apiKey) {
    throw new Error('ARIVO_API_KEY environment variable or config.json with apiKey is required');
  }

  return {
    apiKey,
    apiUrl
  };
}