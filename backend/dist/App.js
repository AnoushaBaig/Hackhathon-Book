"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const config_1 = __importDefault(require("./config"));
const logger_1 = require("./utils/logger");
const errorHandler_1 = require("./utils/errorHandler");
const bookRoutes_1 = __importDefault(require("./api/v1/bookRoutes"));
const chatRoutes_1 = __importDefault(require("./api/v1/chatRoutes"));
const exportRoutes_1 = __importDefault(require("./api/v1/exportRoutes"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    initializeMiddlewares() {
        this.app.use((0, helmet_1.default)());
        this.app.use((0, cors_1.default)({
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true
        }));
        this.app.use(express_1.default.json({
            limit: '10mb',
            verify: (req, res, buf, encoding) => {
                req.requestId = this.generateRequestId();
            }
        }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
        this.app.use(logger_1.requestLogger);
    }
    initializeRoutes() {
        this.app.get('/health', (req, res) => {
            res.status(200).json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                requestId: req.requestId
            });
        });
        this.app.use('/api/v1/books', bookRoutes_1.default);
        this.app.use('/api/v1/chat', chatRoutes_1.default);
        this.app.use('/api/v1/export', exportRoutes_1.default);
        this.app.use((req, res) => {
            res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: `Route ${req.originalUrl} not found`,
                },
            });
        });
    }
    initializeErrorHandling() {
        this.app.use(errorHandler_1.errorHandler);
        process.on('unhandledRejection', (reason, promise) => {
            logger_1.logger.error('Unhandled Rejection at:', { promise, reason });
        });
        process.on('uncaughtException', (error) => {
            logger_1.logger.error('Uncaught Exception:', { error: error.message });
            process.exit(1);
        });
    }
    generateRequestId() {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    listen() {
        this.app.listen(config_1.default.port, () => {
            logger_1.logger.info(`Server running on port ${config_1.default.port}`);
            logger_1.logger.info(`API documentation available at http://localhost:${config_1.default.port}/api-docs`);
        });
    }
}
exports.default = App;
//# sourceMappingURL=App.js.map