import 'dotenv/config';
import { Router, Request, Response } from 'express';
import { CommentController } from '../comment/commentController';
import { CommentRepository } from '../comment/commentRepository';

const router = Router();

const commentController = new CommentController(new CommentRepository());

router.post('/ask/:userId', async (req: Request, res: Response) =>
  commentController.askAi(req, res)
);

router.get('/ask/conversation', async (req: Request, res: Response) =>
  commentController.findAllComments(req, res)
);

router.get(
  '/ask/conversation/:conversationId',
  async (req: Request, res: Response) =>
    commentController.getConversation(req, res)
);
export default router;
