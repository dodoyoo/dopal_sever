import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Conversation } from './conversationEntity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'number', nullable: false })
  conversation_id!: number;

  @Column({ type: 'enum', enum: ['user', 'ai'] })
  sender!: 'user' | 'ai';

  @Column({ length: 2000, nullable: false })
  content!: string;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at!: Date;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversation_id' })
  conversation!: Conversation;
}
