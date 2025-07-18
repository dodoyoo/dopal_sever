import { Repository } from 'typeorm';
import { AppDataSource } from '../../models/dataSource';
import { User } from '../user/userEntity';

export class UserRepository {
  private repository: Repository<User>;

  constructor(dataSource?: typeof AppDataSource) {
    this.repository = (dataSource || AppDataSource).getRepository(User);
  }

  // 회원가입
  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const user = this.repository.create(userData);
      return await this.repository.save(user);
    } catch (error) {
      console.error('Error create user:', error);
      throw new Error('Could not create user');
    }
  }

  // 로그인
  async findByEmail(email: string): Promise<User | undefined> {
    try {
      const emails = (await this.repository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .getOne()) as User | undefined;
      return emails;
    } catch (error) {
      console.error('User를 찾을 수 없습니다.', error);
    }
  }
}
