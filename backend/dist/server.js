"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const App_1 = __importDefault(require("./App"));
const logger_1 = require("./utils/logger");
const ChatService_1 = require("./services/ChatService");
const app = new App_1.default();
async function initializeChatbot() {
    try {
        logger_1.logger.info('Initializing chatbot with book content...');
        const chatService = new ChatService_1.ChatService();
        await chatService.initializeBookContent('../Ai-Robotics-Book/docs');
        logger_1.logger.info('Chatbot initialized successfully');
    }
    catch (error) {
        logger_1.logger.error('Failed to initialize chatbot:', error);
    }
}
app.listen();
initializeChatbot().catch(error => {
    logger_1.logger.error('Error during chatbot initialization:', error);
});
//# sourceMappingURL=server.js.map