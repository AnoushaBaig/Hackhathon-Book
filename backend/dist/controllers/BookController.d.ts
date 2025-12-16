import { Request, Response } from 'express';
export declare class BookController {
    private contentGenerationService;
    private bookStructureService;
    private exportService;
    constructor();
    createBook(req: Request, res: Response): Promise<void>;
    getBookById(req: Request, res: Response): Promise<void>;
    getTemplates(req: Request, res: Response): Promise<void>;
    exportBook(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=BookController.d.ts.map