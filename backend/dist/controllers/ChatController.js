"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const ChatService_1 = require("../services/ChatService");
const logger_1 = require("../utils/logger");
class ChatController {
    constructor() {
        this.chatService = new ChatService_1.ChatService();
    }
    async initialize(req, res) {
        try {
            logger_1.logger.info('Initializing chatbot with book content');
            const docsPath = req.body.docsPath || '../../../Ai-Robotics-Book/docs';
            await this.chatService.initializeBookContent(docsPath);
            res.status(200).json({
                success: true,
                message: 'Chatbot initialized with book content successfully'
            });
            logger_1.logger.info('Chatbot initialized successfully');
        }
        catch (error) {
            logger_1.logger.error('Error initializing chatbot', { error: error.message });
            res.status(500).json({
                success: false,
                error: {
                    code: 'INITIALIZATION_ERROR',
                    message: 'Failed to initialize chatbot with book content',
                },
            });
        }
    }
    async query(req, res) {
        try {
            logger_1.logger.info('Processing chat query request');
            const { query, history } = req.body;
            if (!query) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Query is required',
                    },
                });
                return;
            }
            const result = await this.chatService.processQuery(query, history || []);
            res.status(200).json({
                success: true,
                response: result.response,
                sources: result.sources,
                tokensUsed: result.tokensUsed
            });
            logger_1.logger.info('Chat query processed successfully', { query: query.substring(0, 30) + "..." });
        }
        catch (error) {
            logger_1.logger.error('Error processing chat query', { error: error?.message || error });
            res.status(500).json({
                success: false,
                error: {
                    code: 'CHAT_ERROR',
                    message: error?.message || 'Failed to process chat query',
                },
            });
        }
    }
    async queryWithChain(req, res) {
        try {
            logger_1.logger.info('Processing chat query with chain request');
            const { query } = req.body;
            if (!query) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Query is required',
                    },
                });
                return;
            }
            const result = await this.chatService.processQueryWithChain(query);
            res.status(200).json({
                success: true,
                response: result.response,
                sources: result.sources,
                tokensUsed: result.tokensUsed
            });
            logger_1.logger.info('Chat query with chain processed successfully', { query: query.substring(0, 30) + "..." });
        }
        catch (error) {
            logger_1.logger.error('Error processing chat query with chain', { error: error.message });
            res.status(500).json({
                success: false,
                error: {
                    code: 'CHAT_ERROR',
                    message: 'Failed to process chat query',
                },
            });
        }
    }
    async health(req, res) {
        try {
            res.status(200).json({
                success: true,
                status: 'Chat service is running',
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'HEALTH_CHECK_ERROR',
                    message: 'Chat service is not healthy',
                },
            });
        }
    }
}
exports.ChatController = ChatController;
//# sourceMappingURL=ChatController.js.map