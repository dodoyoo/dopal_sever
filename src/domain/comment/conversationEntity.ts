import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../user/userEntity';

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
}
