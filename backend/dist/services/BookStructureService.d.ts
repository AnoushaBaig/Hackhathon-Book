import { BookStructure } from '../models/BookStructure';
import { StyleGuide } from '../models/StyleGuide';
import { BookTemplate } from '../models/BookTemplate';
export declare class BookStructureService {
    getTemplates(): BookTemplate[];
    getTemplateById(id: string): BookTemplate | undefined;
    validateStructure(structure: BookStructure): {
        isValid: boolean;
        errors: string[];
    };
    private validateBookStructure;
    applyTemplate(structure: BookStructure, templateId: string): BookStructure;
    applyStyleGuide(content: string, styleGuide: StyleGuide): string;
    private simplifyContent;
    private addTechnicalDepth;
    private makeConcise;
    private addDetails;
}
//# sourceMappingURL=BookStructureService.d.ts.map