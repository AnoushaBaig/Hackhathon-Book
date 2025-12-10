// Environment configuration management
export interface Config {
  port: number;
  openai: {
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
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  frontend: {
    port: parseInt(process.env.FRONTEND_PORT || '3001', 10),
  },
  server: {
    url: process.env.SERVER_URL || 'http://localhost:3000',
  },
};

// Validate required environment variables
if (!config.openai.apiKey) {
  console.warn('Warning: OPENAI_API_KEY is not set. AI functionality will not work.');
}

export default config;