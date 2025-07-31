import 'dotenv/config';
import { Router, Request, Response } from 'express';
import OpenAI from 'openai';
import { CommentController } from '../comment/commentController';
import { CommentRepository } from '../comment/commentRepository';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const commentController = new CommentController(new CommentRepository());

router.post('/ask/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ message: 'prompt is require' });
    }

    const fakeReq = {
      ...req,
      params: { userId },
      body: { comment },
    } as Partial<Request> as Request;

    const saveQuestion = await commentController.saveQuestionWithoutResponse;

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: comment }],
    });

    const aiAnswer = chatCompletion.choices[0].message.content;

    res.status(200).json({
      message: '질문 저장 및 AI 응답 성공',
      userId,
      question: comment,
      aiAnswer,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'OpenAI API error', error: error.message });
  }
});

export default router;
