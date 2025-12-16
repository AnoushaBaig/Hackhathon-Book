// BookController for book creation and status endpoints
import { Request, Response } from 'express';
import { ContentGenerationService } from '../services/ContentGenerationService';
import { BookStructureService } from '../services/BookStructureService';
import { ExportService } from '../services/ExportService';
import { createBookProject, validateBookProject, BookProject } from '../models/BookProject';
import { defaultTemplates } from '../models/BookTemplate';
import { logger } from '../utils/logger';

export class BookController {
  private contentGenerationService: ContentGenerationService;
  private bookStructureService: BookStructureService;
  private exportService: ExportService;

  constructor() {
    this.contentGenerationService = new ContentGenerationService();
    this.bookStructureService = new BookStructureService();
    this.exportService = new ExportService();
  }

  // Create a new book generation project
  public async createBook(req: Request, res: Response): Promise<void> {
    try {
      logger.info('Creating new book project', { body: req.body });

      // Validate request body
      const { title, topic, description, structureConfig, styleGuide } = req.body;

      if (!title || !topic || !description) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Title, topic, and description are required',
          },
        });
        return;
      }

      // Create book project
      const bookProjectInput = {
        title,
        topic,
        description,
        structureConfig,
        generationStatus: 'pending' as const,
      };

      const validationErrors = validateBookProject(bookProjectInput);
      if (validationErrors.length > 0) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid book project data',
            details: validationErrors,
          },
        });
        return;
      }

      const bookProject = createBookProject(bookProjectInput);

      // Start content generation process
      this.contentGenerationService.generateContent(bookProject);

      res.status(201).json({
        id: bookProject.id,
        title: bookProject.title,
        topic: bookProject.topic,
        description: bookProject.description,
        generationStatus: bookProject.generationStatus,
        createdAt: bookProject.createdAt,
        updatedAt: bookProject.updatedAt,
      });

      logger.info('Book project created successfully', { id: bookProject.id });
    } catch (error) {
      logger.error('Error creating book project', { error: (error as Error).message });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create book project',
        },
      });
    }
  }

  // Get the status and details of a book generation project
  public async getBookById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      logger.info('Fetching book project by ID', { id });

      // In a real implementation, this would fetch from a database
      // For now, we'll return a mock response
      const mockBookProject: BookProject = {
        id,
        title: 'Sample Book',
        topic: 'AI Development',
        description: 'A comprehensive guide to AI development...',
        generationStatus: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
        generatedContentId: 'gc_12345',
      };

      res.json({
        id: mockBookProject.id,
        title: mockBookProject.title,
        topic: mockBookProject.topic,
        description: mockBookProject.description,
        generationStatus: mockBookProject.generationStatus,
        generatedContentId: mockBookProject.generatedContentId,
        createdAt: mockBookProject.createdAt,
        updatedAt: mockBookProject.updatedAt,
      });

      logger.info('Book project fetched successfully', { id });
    } catch (error) {
      logger.error('Error fetching book project', { error: (error as Error).message, id: req.params.id });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch book project',
        },
      });
    }
  }

  // Get available book structure templates
  public async getTemplates(req: Request, res: Response): Promise<void> {
    try {
      logger.info('Fetching book templates');

      // Return default templates
      res.json(defaultTemplates);

      logger.info('Book templates fetched successfully', { count: defaultTemplates.length });
    } catch (error) {
      logger.error('Error fetching book templates', { error: (error as Error).message });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch book templates',
        },
      });
    }
  }

  // Export the generated book in the specified format
  public async exportBook(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { format } = req.body;

      logger.info('Exporting book', { id, format });

      if (!format) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Export format is required',
          },
        });
        return;
      }

      // In a real implementation, this would fetch the generated content and export it
      // For now, we'll return a mock response
      const exportResult = await this.exportService.exportBook(id, format);

      res.json({
        downloadUrl: exportResult.downloadUrl,
        format: exportResult.format,
        fileSize: exportResult.fileSize,
        createdAt: exportResult.createdAt,
      });

      logger.info('Book exported successfully', { id, format });
    } catch (error) {
      logger.error('Error exporting book', { error: (error as Error).message, id: req.params.id, format: req.body.format });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to export book',
        },
      });
    }
  }
}