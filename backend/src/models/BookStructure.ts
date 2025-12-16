// BookStructure model
export interface BookStructure {
  title: string;
  level: number; // hierarchy level, 1-6
  content: string;
  children: BookStructure[];
  type: 'chapter' | 'section' | 'subsection' | 'appendix';
}

// Validation rules for BookStructure
export const validateBookStructure = (structure: BookStructure): string[] => {
  const errors: string[] = [];

  if (structure.level < 1 || structure.level > 6) {
    errors.push('Level must be between 1 and 6');
  }

  const validTypes: Array<'chapter' | 'section' | 'subsection' | 'appendix'> = ['chapter', 'section', 'subsection', 'appendix'];
  if (!validTypes.includes(structure.type)) {
    errors.push('Type must be one of: chapter, section, subsection, appendix');
  }

  // Validate children hierarchy
  if (structure.children && structure.children.length > 0) {
    for (const child of structure.children) {
      if (child.level <= structure.level) {
        errors.push('Children must have hierarchy levels higher than their parent');
      }
      errors.push(...validateBookStructure(child));
    }
  }

  return errors;
};

// Factory function to create a new BookStructure
export const createBookStructure = (input: Omit<BookStructure, 'children'> & { children?: BookStructure[] }): BookStructure => {
  return {
    ...input,
    children: input.children || [],
  };
};

// Default book structures
export const defaultBookStructures: BookStructure[] = [
  {
    title: 'Introduction',
    level: 1,
    content: '',
    children: [],
    type: 'chapter'
  },
  {
    title: 'Chapter 1',
    level: 1,
    content: '',
    children: [
      {
        title: 'Section 1.1',
        level: 2,
        content: '',
        children: [],
        type: 'section'
      }
    ],
    type: 'chapter'
  }
];