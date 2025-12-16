"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentGenerationService = void 0;
const GeneratedContent_1 = require("../models/GeneratedContent");
const AIClientService_1 = require("./AIClientService");
const logger_1 = require("../utils/logger");
class ContentGenerationService {
    constructor() {
        this.aiClientService = new AIClientService_1.AIClientService();
    }
    async generateContent(bookProject) {
        logger_1.logger.info('Starting content generation for book project', { id: bookProject.id });
        try {
            this.updateProjectStatus(bookProject.id, 'in-progress');
            const generatedText = await this.aiClientService.generateBookContent(bookProject.topic, bookProject.description, bookProject.structureConfig);
            const generatedContent = (0, GeneratedContent_1.createGeneratedContent)({
                projectId: bookProject.id,
                content: generatedText,
                structure: bookProject.structureConfig?.structure || {
                    title: bookProject.title,
                    level: 1,
                    content: generatedText,
                    children: [],
                    type: 'chapter'
                },
                metadata: {
                    wordCount: generatedText.split(' ').length,
                    readingTime: Math.ceil(generatedText.split(' ').length / 200),
                    complexityScore: 75,
                    topicsCovered: [bookProject.topic],
                    references: []
                }
            });
            this.updateProjectStatus(bookProject.id, 'completed', generatedContent.id);
            logger_1.logger.info('Content generation completed successfully', { id: bookProject.id });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger_1.logger.error('Error during content generation', { id: bookProject.id, error: errorMessage });
            this.updateProjectStatus(bookProject.id, 'failed');
            throw error;
        }
    }
    updateProjectStatus(projectId, status, generatedContentId) {
        logger_1.logger.info('Updating project status', { projectId, status, generatedContentId });
    }
    validateContentQuality(content) {
        const issues = [];
        if (content.length < 100) {
            issues.push('Content is too short');
        }
        const paragraphs = content.split('\n\n').filter(p => p.trim() !== '');
        if (paragraphs.length < 2) {
            issues.push('Content should have multiple paragraphs');
        }
        const sentences = content.split(/[.!?]+/).filter(s => s.trim() !== '');
        if (sentences.length === 0) {
            issues.push('Content should have at least one sentence');
        }
        return {
            isValid: issues.length === 0,
            issues
        };
    }
}
exports.ContentGenerationService = ContentGenerationService;
//# sourceMappingURL=ContentGenerationService.js.map