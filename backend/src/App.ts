// Main server application
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config';
import { requestLogger, logger } from './utils/logger';
import { errorHandler } from './utils/errorHandler';
import bookRoutes from './api/v1/bookRoutes';
import chatRoutes from './api/v1/chatRoutes';
import exportRoutes from './api/v1/exportRoutes';

// Extend Express Request type to include custom properties
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());

    // Enable CORS for all routes
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    }));

    // Parse JSON bodies
    this.app.use(express.json({
      limit: '10mb',
      verify: (req, res, buf, encoding) => {
        // Add request ID to request object
        (req as Request).requestId = this.generateRequestId();
      }
    }));

    // Parse URL-encoded bodies
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging middleware
    this.app.use(requestLogger);
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        requestId: req.requestId
      });
    });

    // API routes
    this.app.use('/api/v1/books', bookRoutes);
    this.app.use('/api/v1/chat', chatRoutes);
    this.app.use('/api/v1/export', exportRoutes);

    // Catch-all for undefined routes
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Route ${req.originalUrl} not found`,
        },
      });
    });
  }

  private initializeErrorHandling(): void {
    // Error handling middleware
    this.app.use(errorHandler);

    // Catch unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', { promise, reason });
    });

    // Catch uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', { error: error.message });
      process.exit(1);
    });
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public listen(): void {
    this.app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
      logger.info(`API documentation available at http://localhost:${config.port}/api-docs`);
    });
  }
}

export default App;