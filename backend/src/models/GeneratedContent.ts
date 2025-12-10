// GeneratedContent model
import { BookStructure } from './BookStructure';
import { ContentMetadata } from './ContentMetadata';

export interface GeneratedContent {
  id: string;
  projectId: string;
  content: string;
  structure: BookStructure;
  metadata: ContentMetadata;
  createdAt: Date;
  updatedAt: Date;
  qualityScore?: number; // Automated quality assessment (0-100)
}

// Validation rules for GeneratedContent
export const validateGeneratedContent = (content: Partial<GeneratedContent>): string[] => {
  const errors: string[] = [];

  if (!content.content || content.content.trim() === '') {
    errors.push('Content must be provided and non-empty');
  }

  if (!content.projectId) {
    errors.push('Project ID must reference an existing BookProject');
  }

  if (content.qualityScore !== undefined && (content.qualityScore < 0 || content.qualityScore > 100)) {
    errors.push('Quality score must be between 0 and 100');
  }

  return errors;
};

// Factory function to create a new GeneratedContent
export const createGeneratedContent = (input: Omit<GeneratedContent, 'id' | 'createdAt' | 'updatedAt'>): GeneratedContent => {
  const now = new Date();
  return {
    id: generateId(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
};

// Helper function to generate unique IDs
const generateId = (): string => {
  return `gc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};