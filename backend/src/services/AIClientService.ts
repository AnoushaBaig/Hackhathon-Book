// AIClientService to interface with Google Gemini
import { GoogleGenerativeAI } from "@google/generative-ai";
import config from '../config';
import { BookTemplate } from '../models/BookTemplate';
import { logger } from '../utils/logger';

export class AIClientService {
  private gemini?: GoogleGenerativeAI;

  constructor() {
    if (!config.gemini?.apiKey) {
      logger.warn('Gemini API key not configured. AI functionality will not work.');
    }

    if (config.gemini?.apiKey) {
      this.gemini = new GoogleGenerativeAI(config.gemini.apiKey);
    }
  }

  // Generate book content using AI
  public async generateBookContent(topic: string, description: string, template?: BookTemplate): Promise<string> {
    logger.info('Generating book content with AI', { topic, template: !!template });

    try {
      // Create a prompt for the AI model
      let prompt = `Generate comprehensive book content about: ${topic}\n\n`;
      prompt += `Description: ${description}\n\n`;

      if (template) {
        prompt += `Structure: ${template.name}\n`;
        prompt += `Style: ${template.styleGuide?.tone || 'professional'}\n`;
      }

      prompt += `The content should be professional-level documentation with clear explanations, follow clean and concise writing style without marketing language or fluff, and feel like official engineering documentation or handbooks. Include chapters, sections, and subsections as appropriate for the topic.`;

      // For now, we'll return mock content if no Gemini API key is configured
      if (!config.gemini?.apiKey) {
        logger.warn('Using mock content generation since Gemini API key is not configured');
        return this.generateMockContent(topic, description);
      }

      if (!this.gemini) {
        logger.warn('Gemini client not initialized');
        return this.generateMockContent(topic, description);
      }

      // Use Gemini model
      const model = this.gemini.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Error generating content with AI service', { error: errorMessage });
      throw new Error(`AI content generation failed: ${errorMessage}`);
    }
  }

  // Generate mock content for demonstration purposes
  private generateMockContent(topic: string, description: string): string {
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

  // Validate if the service can make API calls
  public async canConnect(): Promise<boolean> {
    try {
      if (!config.gemini?.apiKey) {
        return false;
      }

      // In a real implementation, we might make a simple API call to test connectivity
      // For now, we'll just check if the API key is set
      return !!config.gemini?.apiKey;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Error checking AI service connectivity', { error: errorMessage });
      return false;
    }
  }
}