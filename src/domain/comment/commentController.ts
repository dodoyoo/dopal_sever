import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import { reportErrorMessage } from '../../utils/errorHandling';
import {
  InvalidPropertyError,
  NotFoundDataError,
  PropertyRequiredError,
} from '../../utils/customError';
import { CommentRepository } from './commentRepository';
import OpenAi from 'openai';

export class CommentController {
  private commentRepository: CommentRepository;
  private openai: OpenAi;

  constructor(commentRepository: CommentRepository) {
    this.commentRepository = commentRepository;
    this.openai = new OpenAi({ apiKey: process.env.OPENAI_API_KEY });
  }

  public async askAi(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { comment } = req.body;

      if (!comment) {
        return res.status(400).json({ message: '질문 내용이 필요합니다.' });
      }

      const conversation = await this.commentRepository.createConversation(
        parseInt(userId, 10)
      );
      await this.commentRepository.createMessage(
        conversation.id,
        'user',
        comment
      );

      const chatCompletion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: comment }],
      });
      const aiAnswer = chatCompletion.choices[0].message?.content || '';

      await this.commentRepository.createMessage(
        conversation.id,
        'ai',
        aiAnswer
      );

      res.status(200).json({
        message: '질문과 AI 응답 저장 성공',
        conversationId: conversation.id,
        question: comment,
        aiAnswer,
      });
    } catch (err) {
      return reportErrorMessage(err, res);
    }
  }
}

//   public async createComments(req: Request, res: Response) {
//     try {
//       const { userId } = req.params;
//       const { comment } = req.body;

//       const commentData: Partial<Comment> = {
//         user_id: parseInt(userId, 10),
//         comment,
//       };
//       const content = await this.commentRepository.createConversation(user);
//       res.status(200).json({ message: '게시글이 작성되었습니다.', content });
//     } catch (err: unknown) {
//       return reportErrorMessage(err, res);
//     }
//   }

//   public async saveQuestionWithoutResponse(req: Request, res: Request) {
//     try {
//       const { userId } = req.params;
//       const { comment } = req.body;

//       const commentData = {
//         user_id: parseInt(userId, 10),
//         comment,
//       };
//       const saved = await this.commentRepository.createComment(commentData);
//       return saved;
//     } catch (err: unknown) {
//       return console.error(err);
//     }
//   }

//   public async findAllComments(req: Request, res: Response) {
//     try {
//       const comments: Comment[] = await this.commentRepository.findAllComment();

//       if (comments.length === 0) {
//         const err = new NotFoundDataError('게시글을 찾을 수 없습니다.');
//         return reportErrorMessage(err, res);
//       } else {
//         res.status(200).json({ message: '게시글 가져오기 성공', comments });
//       }
//     } catch (err: unknown) {
//       return reportErrorMessage(err, res);
//     }
//   }

//   public async getComment(req: Request, res: Response) {
//     try {
//       const commentId: number = parseInt(req.params.commentId, 10);

//       if (!commentId) {
//         const err = new PropertyRequiredError('게시글 ID가 필요합니다.');
//         return reportErrorMessage(err, res);
//       }

//       const comment: Comment | null =
//         await this.commentRepository.findCommentById(commentId);

//       if (!comment) {
//         const err = new NotFoundDataError('게시글이 존재하지 않습니다.');
//         return reportErrorMessage(err, res);
//       }

//       return res.status(200).json({ message: '게시글 가져오기 성공', comment });
//     } catch (err: unknown) {
//       return reportErrorMessage(err, res);
//     }
//   }

//   // 질문 삭제
//   public async deleteComment(req: Request, res: Response) {
//     try {
//       const { commentId } = req.params;
//       const { user_id } = req.body;

//       const deleteComment = await this.commentRepository.deleteCommentById(
//         parseInt(commentId, 10),
//         user_id
//       );

//       if (!deleteComment) {
//         const err = new NotFoundDataError('질문을 찾을 수 없습니다.');
//         return reportErrorMessage(err, res);
//       }
//       res.status(200).json({ message: '질문이 삭제되었습니다.' });
//     } catch (err: unknown) {
//       return reportErrorMessage(err, res);
//     }
//   }
