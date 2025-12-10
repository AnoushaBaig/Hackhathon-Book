// StyleGuide model
export interface StyleGuide {
  tone: 'technical' | 'educational' | 'professional' | 'casual';
  targetAudience: 'beginner' | 'intermediate' | 'advanced';
  writingStyle: 'concise' | 'detailed' | 'balanced';
  terminology: string[];
}

// Validation rules for StyleGuide
export const validateStyleGuide = (styleGuide: Partial<StyleGuide>): string[] => {
  const errors: string[] = [];

  const validTones: Array<'technical' | 'educational' | 'professional' | 'casual'> = ['technical', 'educational', 'professional', 'casual'];
  if (styleGuide.tone && !validTones.includes(styleGuide.tone)) {
    errors.push('Tone must be one of: technical, educational, professional, casual');
  }

  const validAudiences: Array<'beginner' | 'intermediate' | 'advanced'> = ['beginner', 'intermediate', 'advanced'];
  if (styleGuide.targetAudience && !validAudiences.includes(styleGuide.targetAudience)) {
    errors.push('Target audience must be one of: beginner, intermediate, advanced');
  }

  const validStyles: Array<'concise' | 'detailed' | 'balanced'> = ['concise', 'detailed', 'balanced'];
  if (styleGuide.writingStyle && !validStyles.includes(styleGuide.writingStyle)) {
    errors.push('Writing style must be one of: concise, detailed, balanced');
  }

  return errors;
};

// Factory function to create a new StyleGuide
export const createStyleGuide = (input: Partial<StyleGuide>): StyleGuide => {
  return {
    tone: input.tone || 'professional',
    targetAudience: input.targetAudience || 'intermediate',
    writingStyle: input.writingStyle || 'balanced',
    terminology: input.terminology || [],
  };
};

// Default style guides
export const defaultStyleGuides: StyleGuide[] = [
  {
    tone: 'technical',
    targetAudience: 'intermediate',
    writingStyle: 'concise',
    terminology: []
  },
  {
    tone: 'educational',
    targetAudience: 'beginner',
    writingStyle: 'detailed',
    terminology: []
  }
];