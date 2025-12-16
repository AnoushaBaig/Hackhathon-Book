"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIClientService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const config_1 = __importDefault(require("../config"));
const logger_1 = require("../utils/logger");
class AIClientService {
    constructor() {
        if (!config_1.default.gemini?.apiKey) {
            logger_1.logger.warn('Gemini API key not configured. AI functionality will not work.');
        }
        if (config_1.default.gemini?.apiKey) {
            this.gemini = new generative_ai_1.GoogleGenerativeAI(config_1.default.gemini.apiKey);
        }
    }
    async generateBookContent(topic, description, template) {
        logger_1.logger.info('Generating book content with AI', { topic, template: !!template });
        try {
            let prompt = `Generate comprehensive book content about: ${topic}\n\n`;
            prompt += `Description: ${description}\n\n`;
            if (template) {
                prompt += `Structure: ${template.name}\n`;
                prompt += `Style: ${template.styleGuide?.tone || 'professional'}\n`;
            }
            prompt += `The content should be professional-level documentation with clear explanations, follow clean and concise writing style without marketing language or fluff, and feel like official engineering documentation or handbooks. Include chapters, sections, and subsections as appropriate for the topic.`;
            if (!config_1.default.gemini?.apiKey) {
                logger_1.logger.warn('Using mock content generation since Gemini API key is not configured');
                return this.generateMockContent(topic, description);
            }
            if (!this.gemini) {
                logger_1.logger.warn('Gemini client not initialized');
                return this.generateMockContent(topic, description);
            }
            const model = this.gemini.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            return text;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger_1.logger.error('Error generating content with AI service', { error: errorMessage });
            throw new Error(`AI content generation failed: ${errorMessage}`);
        }
    }
    generateMockContent(topic, description) {
        const mockContent = `
# ${topic}

## Introduction

${description}

This document provides comprehensive coverage of ${topic}, designed for professional audiences seeking in-depth technical knowledge.

## Chapter 1: Overview

${topic} represents a significant advancement in its field, combining cutting-edge technology with practical implementation approaches. This chapter explores the fundamental concepts and principles that underpin the subject.

### Key Concepts

- Core principles and definitions
- Historical context and evolution
- Current state and applications

## Chapter 2: Technical Implementation

The technical implementation of ${topic} involves several critical components that must work in harmony to achieve optimal results.

### Architecture

The architecture follows established patterns for scalability and maintainability.

### Best Practices

- Follow industry standards
- Maintain code quality
- Document decisions clearly

## Chapter 3: Advanced Topics

Advanced considerations for implementing ${topic} in complex environments.

### Performance Optimization

Strategies for optimizing performance in various scenarios.

### Security Considerations

Critical security aspects that must be addressed.

## Conclusion

This comprehensive guide has covered the essential aspects of ${topic}, providing the foundation for practical implementation and advanced development.
    `;
        return mockContent.trim();
    }
    async canConnect() {
        try {
            if (!config_1.default.gemini?.apiKey) {
                return false;
            }
            return !!config_1.default.gemini?.apiKey;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger_1.logger.error('Error checking AI service connectivity', { error: errorMessage });
            return false;
        }
    }
}
exports.AIClientService = AIClientService;
//# sourceMappingURL=AIClientService.js.map