import { BookProject } from '../models/BookProject';
export declare class ContentGenerationService {
    private aiClientService;
    constructor();
    generateContent(bookProject: BookProject): Promise<void>;
    private updateProjectStatus;
    validateContentQuality(content: string): {
        isValid: boolean;
        issues: string[];
    };
}
//# sourceMappingURL=ContentGenerationService.d.ts.map