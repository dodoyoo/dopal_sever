import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import { reportErrorMessage } from '../../utils/errorHandling';
import {
  InvalidPropertyError,
  NotFoundDataError,
  PropertyRequiredError,
} from '../../utils/customError';
import { CommentRepository } from './commentRepository';
import { Comment } from './commentEntity';

export class CommentController {
  private commentRepository: CommentRepository;

  constructor(commentRepository: CommentRepository) {
    this.commentRepository = commentRepository;
  }

  public async createComments(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { comment } = req.body;

      const commentData: Partial<Comment> = {
        user_id: parseInt(userId, 10),
        comment,
      };
      const content = await this.commentRepository.createComment(commentData);
      res.status(200).json({ message: '게시글이 작성되었습니다.', content });
    } catch (err: unknown) {
      return reportErrorMessage(err, res);
    }
  }

  public async findAllComments(req: Request, res: Response) {
    try {
      const comments: Comment[] = await this.commentRepository.findAllComment();

      if (comments.length === 0) {
        const err = new NotFoundDataError('게시글을 찾을 수 없습니다.');
        return reportErrorMessage(err, res);
      } else {
        res.status(200).json({ message: '게시글 가져오기 성공', comments });
      }
    } catch (err: unknown) {
      return reportErrorMessage(err, res);
    }
  }

  public async getComment(req: Request, res: Response) {
    try {
      const commentId: number = parseInt(req.params.commentId, 10);

      if (!commentId) {
        const err = new PropertyRequiredError('게시글 ID가 필요합니다.');
        return reportErrorMessage(err, res);
      }

      const comment: Comment | null =
        await this.commentRepository.findCommentById(commentId);

      if (!comment) {
        const err = new NotFoundDataError('게시글이 존재하지 않습니다.');
        return reportErrorMessage(err, res);
      }

      return res.status(200).json({ message: '게시글 가져오기 성공', comment });
    } catch (err: unknown) {
      return reportErrorMessage(err, res);
    }
  }
}
