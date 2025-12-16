import { BookTemplate } from './BookTemplate';
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
export declare const validateBookProject: (project: Partial<BookProject>) => string[];
export declare const createBookProject: (input: Omit<BookProject, "id" | "createdAt" | "updatedAt">) => BookProject;
//# sourceMappingURL=BookProject.d.ts.map