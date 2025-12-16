// API routes for chat functionality
import { Router } from 'express';
import { ChatController } from '../../controllers/ChatController';

const router = Router();
const chatController = new ChatController();

// Health check
router.get('/health', chatController.health.bind(chatController));

// Initialize chatbot with book content
router.post('/initialize', chatController.initialize.bind(chatController));

// Process chat queries
router.post('/query', chatController.query.bind(chatController));

// Process chat queries with chain approach
router.post('/query-chain', chatController.queryWithChain.bind(chatController));

export default router;