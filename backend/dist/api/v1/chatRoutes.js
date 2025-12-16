"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ChatController_1 = require("../../controllers/ChatController");
const router = (0, express_1.Router)();
const chatController = new ChatController_1.ChatController();
router.get('/health', chatController.health.bind(chatController));
router.post('/initialize', chatController.initialize.bind(chatController));
router.post('/query', chatController.query.bind(chatController));
router.post('/query-chain', chatController.queryWithChain.bind(chatController));
exports.default = router;
//# sourceMappingURL=chatRoutes.js.map