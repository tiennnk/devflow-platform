import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { TaskStatus } from './enums/task-status.enum';

import { User } from '../users/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO
  })
  status!: TaskStatus;

  @ManyToOne(() => User, (user) => user.tasks)
  user!: User;
}
