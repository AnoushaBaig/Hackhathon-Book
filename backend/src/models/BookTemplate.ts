// BookTemplate model
import { BookStructure } from './BookStructure';
import { StyleGuide } from './StyleGuide';

export interface BookTemplate {
  id: string;
  name: string;
  description: string;
  structure: BookStructure;
  styleGuide: StyleGuide;
  exportFormats: ExportFormatId[];
  isDefault: boolean;
}

// Type for export format IDs
export type ExportFormatId = 'pdf' | 'html' | 'markdown';

// Validation rules for BookTemplate
export const validateBookTemplate = (template: Partial<BookTemplate>): string[] => {
  const errors: string[] = [];

  if (!template.name) {
    errors.push('Template name is required');
  }

  // Note: We can't validate uniqueness of name here as it requires database access
  // Uniqueness validation would happen at the service level

  if (template.structure && !isValidBookStructure(template.structure)) {
    errors.push('Structure must follow proper hierarchy');
  }

  if (template.exportFormats && !isValidExportFormats(template.exportFormats)) {
    errors.push('Export formats must contain valid format identifiers');
  }

  return errors;
};

// Helper function to validate book structure
const isValidBookStructure = (structure: BookStructure): boolean => {
  // Basic validation - would be more complex in a real implementation
  return structure.title !== undefined && structure.level !== undefined;
};

// Helper function to validate export formats
const isValidExportFormats = (formats: ExportFormatId[]): boolean => {
  const validFormats: ExportFormatId[] = ['pdf', 'html', 'markdown'];
  return formats.every(format => validFormats.includes(format));
};

// Factory function to create a new BookTemplate
export const createBookTemplate = (input: Omit<BookTemplate, 'id'>): BookTemplate => {
  return {
    id: generateId(),
    ...input,
    isDefault: input.isDefault || false,
  };
};

// Helper function to generate unique IDs
const generateId = (): string => {
  return `bt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Default templates
export const defaultTemplates: BookTemplate[] = [
  {
    id: 'default-tech',
    name: 'Technical Documentation',
    description: 'Template for technical documentation with API references, code examples, and architecture diagrams',
    structure: {
      title: 'Technical Documentation',
      level: 1,
      content: '',
      children: [],
      type: 'chapter'
    },
    styleGuide: {
      tone: 'technical',
      targetAudience: 'intermediate',
      writingStyle: 'concise',
      terminology: []
    },
    exportFormats: ['pdf', 'html', 'markdown'],
    isDefault: true
  }
];