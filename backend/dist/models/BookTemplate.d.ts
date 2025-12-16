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
export type ExportFormatId = 'pdf' | 'html' | 'markdown';
export declare const validateBookTemplate: (template: Partial<BookTemplate>) => string[];
export declare const createBookTemplate: (input: Omit<BookTemplate, "id">) => BookTemplate;
export declare const defaultTemplates: BookTemplate[];
//# sourceMappingURL=BookTemplate.d.ts.map