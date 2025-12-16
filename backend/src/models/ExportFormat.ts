// ExportFormat model
export interface ExportFormat {
  id: ExportFormatId;
  name: string;
  description: string;
  mimeType: string;
  supportedFeatures: string[];
}

// Type for export format IDs
export type ExportFormatId = 'pdf' | 'html' | 'markdown';

// Validation rules for ExportFormat
export const validateExportFormat = (format: Partial<ExportFormat>): string[] => {
  const errors: string[] = [];

  if (!format.id || !isValidFormatId(format.id)) {
    errors.push('ID must be a standard format identifier (pdf, html, markdown)');
  }

  if (!format.mimeType || !isValidMimeType(format.mimeType)) {
    errors.push('MIME type must be a valid MIME type');
  }

  if (format.supportedFeatures && !Array.isArray(format.supportedFeatures)) {
    errors.push('Supported features must be an array of valid features');
  }

  return errors;
};

// Helper function to validate format ID
const isValidFormatId = (id: ExportFormatId): boolean => {
  const validIds: ExportFormatId[] = ['pdf', 'html', 'markdown'];
  return validIds.includes(id);
};

// Helper function to validate MIME type
const isValidMimeType = (mimeType: string): boolean => {
  // Basic validation - would be more complex in a real implementation
  const mimeTypeRegex = /^[a-z]+\/[a-z0-9\-\+\.]+$/i;
  return mimeTypeRegex.test(mimeType);
};

// Factory function to create a new ExportFormat
export const createExportFormat = (input: Omit<ExportFormat, 'id'> & { id: ExportFormatId }): ExportFormat => {
  return {
    ...input,
    id: input.id,
  };
};

// Default export formats
export const defaultExportFormats: ExportFormat[] = [
  {
    id: 'pdf',
    name: 'Portable Document Format',
    description: 'PDF format for document sharing and printing',
    mimeType: 'application/pdf',
    supportedFeatures: ['formatting', 'images', 'tables', 'toc']
  },
  {
    id: 'html',
    name: 'HyperText Markup Language',
    description: 'HTML format for web viewing',
    mimeType: 'text/html',
    supportedFeatures: ['formatting', 'images', 'links', 'styles']
  },
  {
    id: 'markdown',
    name: 'Markdown',
    description: 'Markdown format for plain text documentation',
    mimeType: 'text/markdown',
    supportedFeatures: ['formatting', 'links', 'code', 'lists']
  }
];