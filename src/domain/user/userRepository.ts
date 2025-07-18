import { Repository } from 'typeorm';
import { AppDataSource } from '../../models/dataSource';
import { User } from '../user/userEntity';

export class UserRepository {
  private repository: Repository<User>;

  constructor(dataSource?: typeof AppDataSource) {
    this.repository = (dataSource || AppDataSource).getRepository(User);
  }
  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const user = this.repository.create(userData);
      return await this.repository.save(user);
    } catch (error) {
      console.error('Error create user:', error);
      throw new Error('Could not create user');
    }
  }
}
