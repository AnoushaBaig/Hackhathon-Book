import { BookTemplate } from '../models/BookTemplate';
export declare class AIClientService {
    private gemini?;
    constructor();
    generateBookContent(topic: string, description: string, template?: BookTemplate): Promise<string>;
    private generateMockContent;
    canConnect(): Promise<boolean>;
}
//# sourceMappingURL=AIClientService.d.ts.map