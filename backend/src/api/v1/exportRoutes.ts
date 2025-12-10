// Export-related API routes
import { Router, Request, Response } from 'express';
import { BookController } from '../../controllers/BookController';

const router = Router();
const bookController = new BookController();

// POST /books/:id/export - Export the generated book in the specified format
router.post('/:id/export', async (req: Request, res: Response) => {
  try {
    await bookController.exportBook(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to export book',
      },
    });
  }
});

export default router;