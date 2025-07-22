import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import { reportErrorMessage } from '../../utils/errorHandling';
import {
  InvalidPropertyError,
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
}
