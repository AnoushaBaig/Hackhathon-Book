import express from 'express';
declare global {
    namespace Express {
        interface Request {
            requestId?: string;
        }
    }
}
declare class App {
    app: express.Application;
    constructor();
    private initializeMiddlewares;
    private initializeRoutes;
    private initializeErrorHandling;
    private generateRequestId;
    listen(): void;
}
export default App;
//# sourceMappingURL=App.d.ts.map