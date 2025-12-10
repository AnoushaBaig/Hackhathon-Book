// Book-related API routes
import { Router, Request, Response } from 'express';
import { BookController } from '../../controllers/BookController';

const router = Router();
const bookController = new BookController();

// POST /books - Create a new book generation project
router.post('/', async (req: Request, res: Response) => {
  try {
    await bookController.createBook(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create book project',
      },
    });
  }
});

// GET /books/:id - Get the status and details of a book generation project
router.get('/:id', async (req: Request, res: Response) => {
  try {
    await bookController.getBookById(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get book project',
      },
    });
  }
});

// GET /templates - Get available book structure templates
router.get('/templates', async (req: Request, res: Response) => {
  try {
    await bookController.getTemplates(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get templates',
      },
    });
  }
});

export default router;