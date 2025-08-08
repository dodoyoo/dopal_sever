import 'dotenv/config';
import { Router, Request, Response } from 'express';
import OpenAI from 'openai';
import { CommentController } from '../comment/commentController';
import { CommentRepository } from '../comment/commentRepository';

const router = Router();

const commentController = new CommentController(new CommentRepository());

router.post('/ask/:userId', async (req: Request, res: Response) =>
  commentController.askAi(req, res)
);

export default router;
