import { Repository } from 'typeorm';
import { AppDataSource } from '../../models/dataSource';
import { User } from '../user/userEntity';
import { Comment } from './commentEntity';

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
}
