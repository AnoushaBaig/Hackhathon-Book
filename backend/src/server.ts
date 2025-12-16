// Server entry point
import 'dotenv/config';
import App from './App';
import { logger } from './utils/logger';
import { ChatService } from './services/ChatService';

// Initialize the application
const app = new App();

// Initialize the chatbot with book content on startup
async function initializeChatbot() {
  try {
    logger.info('Initializing chatbot with book content...');
    const chatService = new ChatService();
    // Using correct path relative to backend directory
    await chatService.initializeBookContent('../Ai-Robotics-Book/docs');
    logger.info('Chatbot initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize chatbot:', error);
    // Continue starting the server even if initialization fails
  }
}

// Start the server
app.listen();

// Initialize chatbot in the background
initializeChatbot().catch(error => {
  logger.error('Error during chatbot initialization:', error);
});