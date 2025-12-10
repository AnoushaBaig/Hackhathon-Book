// ContentMetadata model
export interface ContentMetadata {
  wordCount: number;
  readingTime: number; // estimated reading time in minutes
  complexityScore: number; // readability/complexity rating (0-100)
  topicsCovered: string[];
  references: string[];
}

// Validation rules for ContentMetadata
export const validateContentMetadata = (metadata: Partial<ContentMetadata>): string[] => {
  const errors: string[] = [];

  if (metadata.wordCount !== undefined && metadata.wordCount < 0) {
    errors.push('Word count must be non-negative');
  }

  if (metadata.readingTime !== undefined && metadata.readingTime < 0) {
    errors.push('Reading time must be non-negative');
  }

  if (metadata.complexityScore !== undefined && (metadata.complexityScore < 0 || metadata.complexityScore > 100)) {
    errors.push('Complexity score must be between 0 and 100');
  }

  return errors;
};

// Factory function to create a new ContentMetadata
export const createContentMetadata = (input: Partial<ContentMetadata>): ContentMetadata => {
  return {
    wordCount: input.wordCount || 0,
    readingTime: input.readingTime || 0,
    complexityScore: input.complexityScore || 0,
    topicsCovered: input.topicsCovered || [],
    references: input.references || [],
  };
};