// ContentGenerationService
import { BookProject } from '../models/BookProject';
import { GeneratedContent, createGeneratedContent } from '../models/GeneratedContent';
import { AIClientService } from './AIClientService';
import { logger } from '../utils/logger';

export class ContentGenerationService {
  private aiClientService: AIClientService;

  constructor() {
    this.aiClientService = new AIClientService();
  }

  // Generate content for a book project
  public async generateContent(bookProject: BookProject): Promise<void> {
    logger.info('Starting content generation for book project', { id: bookProject.id });

    try {
      // Update project status to in-progress
      this.updateProjectStatus(bookProject.id, 'in-progress');

      // Generate content using AI
      const generatedText = await this.aiClientService.generateBookContent(
        bookProject.topic,
        bookProject.description,
        bookProject.structureConfig
      );

      // Create generated content object
      const generatedContent = createGeneratedContent({
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
          readingTime: Math.ceil(generatedText.split(' ').length / 200), // approx 200 wpm
          complexityScore: 75, // placeholder value
          topicsCovered: [bookProject.topic],
          references: []
        }
      });

      // Update project status to completed
      this.updateProjectStatus(bookProject.id, 'completed', generatedContent.id);

      logger.info('Content generation completed successfully', { id: bookProject.id });
    } catch (error) {
      logger.error('Error during content generation', { id: bookProject.id, error: error.message });

      // Update project status to failed
      this.updateProjectStatus(bookProject.id, 'failed');

      throw error;
    }
  }

  // Update project status (in a real implementation, this would update the database)
  private updateProjectStatus(projectId: string, status: 'pending' | 'in-progress' | 'completed' | 'failed', generatedContentId?: string): void {
    logger.info('Updating project status', { projectId, status, generatedContentId });
    // In a real implementation, this would update the database
    // For now, we're just logging the status change
  }

  // Validate content quality based on specified metrics
  public validateContentQuality(content: string): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check for minimum length
    if (content.length < 100) {
      issues.push('Content is too short');
    }

    // Check for basic structure (has paragraphs)
    const paragraphs = content.split('\n\n').filter(p => p.trim() !== '');
    if (paragraphs.length < 2) {
      issues.push('Content should have multiple paragraphs');
    }

    // Check for basic readability (very simple check)
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