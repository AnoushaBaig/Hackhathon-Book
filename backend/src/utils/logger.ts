// Logging infrastructure
import { Request, Response, NextFunction } from 'express';

// Log level type
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Log entry interface
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  meta?: any;
}

// Simple logger class
export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = 'info';

  private constructor() {}

  // Singleton pattern
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // Set log level
  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  // Log method
  public log(level: LogLevel, message: string, meta?: any): void {
    if (this.shouldLog(level)) {
      const logEntry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        meta,
      };

      // Write to console (in a real app, this might write to a file or external service)
      console.log(JSON.stringify(logEntry));
    }
  }

  // Convenience methods
  public debug(message: string, meta?: any): void {
    this.log('debug', message, meta);
  }

  public info(message: string, meta?: any): void {
    this.log('info', message, meta);
  }

  public warn(message: string, meta?: any): void {
    this.log('warn', message, meta);
  }

  public error(message: string, meta?: any): void {
    this.log('error', message, meta);
  }

  // Check if the log level should be output
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }
}

// Create logger instance
export const logger = Logger.getInstance();

// Express middleware for request logging
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logMessage = `${req.method} ${req.path} ${res.statusCode} ${duration}ms`;

    if (res.statusCode >= 500) {
      logger.error(logMessage, {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
      });
    } else if (res.statusCode >= 400) {
      logger.warn(logMessage, {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
      });
    } else {
      logger.info(logMessage, {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
      });
    }
  });

  next();
};