import { Repository } from 'typeorm';
import { AppDataSource } from '../../models/dataSource';
import { User } from '../user/userEntity';
import { Conversation } from './conversationEntity';
import { Message } from './messageEntity';
import { Comment } from './commentEntity';
import { PropertyRequiredError } from '../../utils/customError';

export class CommentRepository {
  private conversationRepo: Repository<Conversation>;
  private messageRepo: Repository<Message>;

  constructor() {
    this.conversationRepo = AppDataSource.getRepository(Conversation);
    this.messageRepo = AppDataSource.getRepository(Message);
  }

  // 새 대화 생성
  public async createConversation(userId: number): Promise<Conversation> {
    const conversation = this.conversationRepo.create({ user_id: userId });
    return await this.conversationRepo.save(conversation);
  }

  // 메시지 생성
  public async createMessage(
    conversationId: number,
    sender: 'user' | 'ai',
    content: string
  ): Promise<Message> {
    const message = this.messageRepo.create({
      conversation_id: conversationId,
      sender,
      content,
    });

    return await this.messageRepo.save(message);
  }

  public async findAllConversation(): Promise<Conversation[]> {
    try {
      const comments = await this.conversationRepo
        .createQueryBuilder('conversation')
        .leftJoinAndSelect('conversation.messages', 'message')
        .leftJoinAndSelect('conversation.user', 'user')
        .orderBy('conversation.created_at', 'DESC')
        .addOrderBy('message.created_at', 'ASC')
        .getMany();
      return comments;
    } catch (error) {
      console.error('대화를 불러오는데 실패했습니다.', error);
      throw new PropertyRequiredError('Failed to get all conversations');
    }
  }
  public async findCommentById(id: number): Promise<Conversation | null> {
    try {
      return await this.conversationRepo.findOne({
        where: { id },
        relations: ['user', 'messages'],
        order: { messages: { created_at: 'ASC' } },
      });
    } catch (error) {
      console.error('대화를 찾는데 실패했습니다.', error);
      throw new PropertyRequiredError('Failed to find comment');
    }
  }
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
