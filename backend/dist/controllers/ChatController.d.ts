import { Request, Response } from 'express';
export declare class ChatController {
    private chatService;
    constructor();
    initialize(req: Request, res: Response): Promise<void>;
    query(req: Request, res: Response): Promise<void>;
    queryWithChain(req: Request, res: Response): Promise<void>;
    health(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=ChatController.d.ts.map