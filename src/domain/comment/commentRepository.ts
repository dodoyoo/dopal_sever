import { Repository } from 'typeorm';
import { AppDataSource } from '../../models/dataSource';
import { User } from '../user/userEntity';
import { Comment } from './commentEntity';
import { PropertyRequiredError } from '../../utils/customError';

export class CommentRepository {
  private repository: Repository<Comment>;

  constructor(dataSource?: typeof AppDataSource) {
    this.repository = (dataSource || AppDataSource).getRepository(Comment);
  }

  public async createComment(commentData: Partial<Comment>): Promise<Comment> {
    try {
      const comment = this.repository.create(commentData);
      return await this.repository.save(comment);
    } catch (error) {
      console.log('Error comment');
      throw new Error('Could not create comment');
    }
  }

  public async findAllComment(): Promise<Comment[]> {
    try {
      const comments = await this.repository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .select(['user.id', 'comment'])
        .orderBy('comment.created_at', 'DESC')
        .getMany();
      return comments;
    } catch (error) {
      console.error('게시글을 불러오는데 실패했습니다.', error);
      throw new PropertyRequiredError('Failed to get all comments');
    }
  }
}
