"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BookController_1 = require("../../controllers/BookController");
const router = (0, express_1.Router)();
const bookController = new BookController_1.BookController();
router.post('/', async (req, res) => {
    try {
        await bookController.createBook(req, res);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Failed to create book project',
            },
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        await bookController.getBookById(req, res);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Failed to get book project',
            },
        });
    }
});
router.get('/templates', async (req, res) => {
    try {
        await bookController.getTemplates(req, res);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Failed to get templates',
            },
        });
    }
});
exports.default = router;
//# sourceMappingURL=bookRoutes.js.map