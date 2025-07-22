import { Request, Response, Router } from 'express';
import { CommentController } from './commentController';
import { CommentRepository } from './commentRepository';

const router = Router();
const commentRepository = new CommentRepository();
const commentController = new CommentController(commentRepository);

router.post('/api/comment/:userId', (req: Request, res: Response) =>
  commentController.createComments(req, res)
);

export default router;
