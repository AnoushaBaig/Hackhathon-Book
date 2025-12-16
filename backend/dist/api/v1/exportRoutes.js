"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BookController_1 = require("../../controllers/BookController");
const router = (0, express_1.Router)();
const bookController = new BookController_1.BookController();
router.post('/:id/export', async (req, res) => {
    try {
        await bookController.exportBook(req, res);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Failed to export book',
            },
        });
    }
});
exports.default = router;
//# sourceMappingURL=exportRoutes.js.map