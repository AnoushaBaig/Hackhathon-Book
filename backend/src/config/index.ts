// Environment configuration management
export interface Config {
  port: number;
  gemini?: {
    apiKey: string;
  };
  openai?: {
    apiKey: string;
  };
  frontend: {
    port: number;
  };
  server: {
    url: string;
  };
}

// Default configuration
const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  gemini: process.env.GEMINI_API_KEY ? {
    apiKey: process.env.GEMINI_API_KEY,
  } : undefined,
  openai: process.env.OPENAI_API_KEY ? {
    apiKey: process.env.OPENAI_API_KEY,
  } : undefined,
  frontend: {
    port: parseInt(process.env.FRONTEND_PORT || '3001', 10),
  },
  server: {
    url: process.env.SERVER_URL || 'http://localhost:3000',
  },
};

// Validate required environment variables
if (!config.gemini?.apiKey && !config.openai?.apiKey) {
  console.warn('Warning: Neither GEMINI_API_KEY nor OPENAI_API_KEY is set. AI functionality will not work.');
}

export default config;