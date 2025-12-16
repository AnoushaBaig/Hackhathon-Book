"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = exports.logger = exports.Logger = void 0;
class Logger {
    constructor() {
        this.logLevel = 'info';
    }
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    setLogLevel(level) {
        this.logLevel = level;
    }
    log(level, message, meta) {
        if (this.shouldLog(level)) {
            const logEntry = {
                timestamp: new Date().toISOString(),
                level,
                message,
                meta,
            };
            console.log(JSON.stringify(logEntry));
        }
    }
    debug(message, meta) {
        this.log('debug', message, meta);
    }
    info(message, meta) {
        this.log('info', message, meta);
    }
    warn(message, meta) {
        this.log('warn', message, meta);
    }
    error(message, meta) {
        this.log('error', message, meta);
    }
    shouldLog(level) {
        const levels = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(level) >= levels.indexOf(this.logLevel);
    }
}
exports.Logger = Logger;
exports.logger = Logger.getInstance();
const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const logMessage = `${req.method} ${req.path} ${res.statusCode} ${duration}ms`;
        if (res.statusCode >= 500) {
            exports.logger.error(logMessage, {
                method: req.method,
                path: req.path,
                statusCode: res.statusCode,
                duration: `${duration}ms`,
                userAgent: req.get('User-Agent'),
                ip: req.ip,
            });
        }
        else if (res.statusCode >= 400) {
            exports.logger.warn(logMessage, {
                method: req.method,
                path: req.path,
                statusCode: res.statusCode,
                duration: `${duration}ms`,
                userAgent: req.get('User-Agent'),
                ip: req.ip,
            });
        }
        else {
            exports.logger.info(logMessage, {
                method: req.method,
                path: req.path,
                statusCode: res.statusCode,
                duration: `${duration}ms`,
                userAgent: req.get('User-Agent'),
                ip: req.ip,
            });
        }
    });
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=logger.js.map