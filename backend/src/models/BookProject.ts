// BookProject model
export interface BookProject {
  id: string;
  title: string;
  topic: string;
  description: string;
  structureConfig?: BookTemplate;
  generationStatus: 'pending' | 'in-progress' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  generatedContentId?: string;
  userId?: string;
}

// Validation rules for BookProject
export const validateBookProject = (project: Partial<BookProject>): string[] => {
  const errors: string[] = [];

  if (!project.title || project.title.length < 1 || project.title.length > 200) {
    errors.push('Title must be between 1 and 200 characters');
  }

  if (!project.topic) {
    errors.push('Topic is required');
  }

  if (!project.description || project.description.length < 10 || project.description.length > 5000) {
    errors.push('Description must be between 10 and 5000 characters');
  }

  if (project.generationStatus && !['pending', 'in-progress', 'completed', 'failed'].includes(project.generationStatus)) {
    errors.push('Generation status must be one of: pending, in-progress, completed, failed');
  }

  return errors;
};

// Factory function to create a new BookProject
export const createBookProject = (input: Omit<BookProject, 'id' | 'createdAt' | 'updatedAt'>): BookProject => {
  const now = new Date();
  return {
    id: generateId(),
    ...input,
    generationStatus: input.generationStatus || 'pending',
    createdAt: now,
    updatedAt: now,
  };
};

// Helper function to generate unique IDs
const generateId = (): string => {
  return `bp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};