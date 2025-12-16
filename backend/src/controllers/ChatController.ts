// ChatController for handling chatbot API requests
import { Request, Response } from 'express';
import { ChatService } from '../services/ChatService';
import { logger } from '../utils/logger';

export class ChatController {
  private chatService: ChatService;

  constructor() {
    this.chatService = new ChatService();
  }

  // Initialize the chatbot with book content
  public async initialize(req: Request, res: Response): Promise<void> {
    try {
      logger.info('Initializing chatbot with book content');

      const docsPath = req.body.docsPath || '../../../Ai-Robotics-Book/docs';

      await this.chatService.initializeBookContent(docsPath);

      res.status(200).json({
        success: true,
        message: 'Chatbot initialized with book content successfully'
      });

      logger.info('Chatbot initialized successfully');
    } catch (error) {
      logger.error('Error initializing chatbot', { error: (error as Error).message });

      res.status(500).json({
        success: false,
        error: {
          code: 'INITIALIZATION_ERROR',
          message: 'Failed to initialize chatbot with book content',
        },
      });
    }
  }

  // Handle chat queries
  public async query(req: Request, res: Response): Promise<void> {
    try {
      logger.info('Processing chat query request');

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

      // Process the query using the chat service
      const result = await this.chatService.processQuery(query, history || []);

      res.status(200).json({
        success: true,
        response: result.response,
        sources: result.sources,
        tokensUsed: result.tokensUsed
      });

      logger.info('Chat query processed successfully', { query: query.substring(0, 30) + "..." });
    } catch (error) {
      logger.error('Error processing chat query', { error: (error as Error)?.message || error });

      // Return a more informative error response
      res.status(500).json({
        success: false,
        error: {
          code: 'CHAT_ERROR',
          message: (error as Error)?.message || 'Failed to process chat query',
        },
      });
    }
  }

  // Alternative endpoint using the chain-based approach
  public async queryWithChain(req: Request, res: Response): Promise<void> {
    try {
      logger.info('Processing chat query with chain request');

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

      // Process the query using the chain-based approach
      const result = await this.chatService.processQueryWithChain(query);

      res.status(200).json({
        success: true,
        response: result.response,
        sources: result.sources,
        tokensUsed: result.tokensUsed
      });

      logger.info('Chat query with chain processed successfully', { query: query.substring(0, 30) + "..." });
    } catch (error) {
      logger.error('Error processing chat query with chain', { error: (error as Error).message });

      res.status(500).json({
        success: false,
        error: {
          code: 'CHAT_ERROR',
          message: 'Failed to process chat query',
        },
      });
    }
  }

  // Health check endpoint
  public async health(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        status: 'Chat service is running',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
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