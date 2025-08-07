import { Repository } from 'typeorm';
import { AppDataSource } from '../../models/dataSource';
import { User } from '../user/userEntity';
import { Conversation } from './conversationEntity';
import { Message } from './messageEntity';
import { Comment } from './commentEntity';
import { PropertyRequiredError } from '../../utils/customError';

export class CommentRepository {
  private repository: Repository<Conversation>;

  constructor() {
    this.repository = AppDataSource.getRepository(Conversation);
  }

  //   public async createComment(commentData: Partial<Comment>): Promise<Comment> {
  //     try {
  //       const comment = this.repository.create(commentData);
  //       return await this.repository.save(comment);
  //     } catch (error) {
  //       console.log('Error comment');
  //       throw new Error('Could not create comment');
  //     }
  //   }

  // public async findAllComment(): Promise<Comment[]> {
  //   try {
  //     const comments = await this.repository
  //       .createQueryBuilder('comment')
  //       .leftJoinAndSelect('comment.user', 'user')
  //       .select(['user.id', 'comment'])
  //       .orderBy('comment.created_at', 'DESC')
  //       .getMany();
  //     return comments;
  //   } catch (error) {
  //     console.error('게시글을 불러오는데 실패했습니다.', error);
  //     throw new PropertyRequiredError('Failed to get all comments');
  //   }
  // }

  // public async findCommentById(id: number): Promise<Comment | null> {
  //   try {
  //     return await this.repository.findOne({
  //       where: { id },
  //       relations: ['user'],
  //     });
  //   } catch (error) {
  //     console.error('게시글을 찾는데 실패했습니다.', error);
  //     throw new PropertyRequiredError('Failed to find comment');
  //   }
  // }

  // // 질문 삭제
  // public async deleteCommentById(
  //   id: number,
  //   user_id: number
  // ): Promise<boolean> {
  //   try {
  //     const comment = await this.findCommentById(id);
  //     if (comment?.user.id !== user_id) {
  //       throw new PropertyRequiredError('권한이 없습니다.');
  //     }
  //     await this.repository.remove(comment);
  //     return true;
  //   } catch (error) {
  //     console.error('질문 삭제에 실패했습니다.', error);
  //     throw error;
  //   }
  // }
}
