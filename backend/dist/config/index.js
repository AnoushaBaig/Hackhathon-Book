"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
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
if (!config.gemini?.apiKey && !config.openai?.apiKey) {
    console.warn('Warning: Neither GEMINI_API_KEY nor OPENAI_API_KEY is set. AI functionality will not work.');
}
exports.default = config;
//# sourceMappingURL=index.js.map