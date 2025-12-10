// BookStructureService
import { BookStructure } from '../models/BookStructure';
import { StyleGuide } from '../models/StyleGuide';
import { BookTemplate, defaultTemplates } from '../models/BookTemplate';
import { logger } from '../utils/logger';

export class BookStructureService {
  // Get available book templates
  public getTemplates(): BookTemplate[] {
    logger.info('Retrieving available book templates', { count: defaultTemplates.length });
    return [...defaultTemplates]; // Return a copy to prevent mutation
  }

  // Get a specific template by ID
  public getTemplateById(id: string): BookTemplate | undefined {
    logger.info('Retrieving template by ID', { id });
    return defaultTemplates.find(template => template.id === id);
  }

  // Validate a book structure
  public validateStructure(structure: BookStructure): { isValid: boolean; errors: string[] } {
    const errors = this.validateBookStructure(structure);
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Helper method to validate book structure (using the validation from the model)
  private validateBookStructure(structure: BookStructure): string[] {
    // Import the validation function from the model
    // Since we can't directly import from the model file here, we'll implement basic validation
    const errors: string[] = [];

    if (structure.level < 1 || structure.level > 6) {
      errors.push('Level must be between 1 and 6');
    }

    const validTypes = ['chapter', 'section', 'subsection', 'appendix'];
    if (!validTypes.includes(structure.type)) {
      errors.push('Type must be one of: chapter, section, subsection, appendix');
    }

    // Validate children hierarchy
    if (structure.children && structure.children.length > 0) {
      for (const child of structure.children) {
        if (child.level <= structure.level) {
          errors.push('Children must have hierarchy levels higher than their parent');
        }
        errors.push(...this.validateBookStructure(child));
      }
    }

    return errors;
  }

  // Apply a template to a book structure
  public applyTemplate(structure: BookStructure, templateId: string): BookStructure {
    logger.info('Applying template to book structure', { templateId });

    const template = this.getTemplateById(templateId);
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }

    // Apply template structure to the provided structure
    // This is a simplified implementation - in a real app, this would be more complex
    return {
      ...structure,
      ...template.structure,
      children: template.structure.children
    };
  }

  // Apply a style guide to content
  public applyStyleGuide(content: string, styleGuide: StyleGuide): string {
    logger.info('Applying style guide to content', {
      tone: styleGuide.tone,
      targetAudience: styleGuide.targetAudience,
      writingStyle: styleGuide.writingStyle
    });

    // This is a simplified implementation
    // In a real app, this would modify the content based on the style guide
    let styledContent = content;

    // Adjust complexity based on target audience
    if (styleGuide.targetAudience === 'beginner') {
      // Simplify complex sentences, add more explanations
      styledContent = this.simplifyContent(styledContent);
    } else if (styleGuide.targetAudience === 'advanced') {
      // Add more technical depth
      styledContent = this.addTechnicalDepth(styledContent);
    }

    // Adjust writing style
    if (styleGuide.writingStyle === 'concise') {
      styledContent = this.makeConcise(styledContent);
    } else if (styleGuide.writingStyle === 'detailed') {
      styledContent = this.addDetails(styledContent);
    }

    return styledContent;
  }

  // Helper methods for style guide application
  private simplifyContent(content: string): string {
    // Simplify complex sentences and concepts
    return content.replace(/\b(?:therefore|consequently|subsequently|nevertheless|accordingly)\b/gi, 'so');
  }

  private addTechnicalDepth(content: string): string {
    // Add more technical explanations and depth
    return content;
  }

  private makeConcise(content: string): string {
    // Remove redundant phrases and make content more direct
    return content;
  }

  private addDetails(content: string): string {
    // Add more examples, explanations, and details
    return content;
  }
}