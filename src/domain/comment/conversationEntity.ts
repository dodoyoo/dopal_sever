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

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'number', nullable: false })
  user_id!: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
}
