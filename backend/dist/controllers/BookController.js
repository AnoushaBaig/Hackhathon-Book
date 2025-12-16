"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookController = void 0;
const ContentGenerationService_1 = require("../services/ContentGenerationService");
const BookStructureService_1 = require("../services/BookStructureService");
const ExportService_1 = require("../services/ExportService");
const BookProject_1 = require("../models/BookProject");
const BookTemplate_1 = require("../models/BookTemplate");
const logger_1 = require("../utils/logger");
class BookController {
    constructor() {
        this.contentGenerationService = new ContentGenerationService_1.ContentGenerationService();
        this.bookStructureService = new BookStructureService_1.BookStructureService();
        this.exportService = new ExportService_1.ExportService();
    }
    async createBook(req, res) {
        try {
            logger_1.logger.info('Creating new book project', { body: req.body });
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
            const bookProjectInput = {
                title,
                topic,
                description,
                structureConfig,
                generationStatus: 'pending',
            };
            const validationErrors = (0, BookProject_1.validateBookProject)(bookProjectInput);
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
            const bookProject = (0, BookProject_1.createBookProject)(bookProjectInput);
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
            logger_1.logger.info('Book project created successfully', { id: bookProject.id });
        }
        catch (error) {
            logger_1.logger.error('Error creating book project', { error: error.message });
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to create book project',
                },
            });
        }
    }
    async getBookById(req, res) {
        try {
            const { id } = req.params;
            logger_1.logger.info('Fetching book project by ID', { id });
            const mockBookProject = {
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
            logger_1.logger.info('Book project fetched successfully', { id });
        }
        catch (error) {
            logger_1.logger.error('Error fetching book project', { error: error.message, id: req.params.id });
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to fetch book project',
                },
            });
        }
    }
    async getTemplates(req, res) {
        try {
            logger_1.logger.info('Fetching book templates');
            res.json(BookTemplate_1.defaultTemplates);
            logger_1.logger.info('Book templates fetched successfully', { count: BookTemplate_1.defaultTemplates.length });
        }
        catch (error) {
            logger_1.logger.error('Error fetching book templates', { error: error.message });
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to fetch book templates',
                },
            });
        }
    }
    async exportBook(req, res) {
        try {
            const { id } = req.params;
            const { format } = req.body;
            logger_1.logger.info('Exporting book', { id, format });
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
            const exportResult = await this.exportService.exportBook(id, format);
            res.json({
                downloadUrl: exportResult.downloadUrl,
                format: exportResult.format,
                fileSize: exportResult.fileSize,
                createdAt: exportResult.createdAt,
            });
            logger_1.logger.info('Book exported successfully', { id, format });
        }
        catch (error) {
            logger_1.logger.error('Error exporting book', { error: error.message, id: req.params.id, format: req.body.format });
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
exports.BookController = BookController;
//# sourceMappingURL=BookController.js.map