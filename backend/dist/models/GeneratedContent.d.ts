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
    qualityScore?: number;
}
export declare const validateGeneratedContent: (content: Partial<GeneratedContent>) => string[];
export declare const createGeneratedContent: (input: Omit<GeneratedContent, "id" | "createdAt" | "updatedAt">) => GeneratedContent;
//# sourceMappingURL=GeneratedContent.d.ts.map