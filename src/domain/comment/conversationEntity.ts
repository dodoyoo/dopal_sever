import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { User } from '../user/userEntity';
import { Message } from './messageEntity';

@Entity('conversation')
export class Conversation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'number', nullable: false })
  user_id!: number;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at!: Date;

  @ManyToOne(() => User, (user) => user.conversations)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => Message, (message) => message.conversation)
  messages!: Message[];
}
