import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Comment } from '../comment/commentEntity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  password!: string;

  @Column({ type: 'varchar', length: 200, nullable: false, unique: true })
  nickname!: string;

  @Column({ type: 'varchar', length: 2048, nullable: true })
  profile_image!: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at!: Date;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Comment[];
}
