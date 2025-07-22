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

@Entity('posts')
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 2000, nullable: false })
  comment!: string;

  @Column({ type: 'number', nullable: false })
  user_id!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at!: Date;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
