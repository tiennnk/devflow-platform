import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Task } from '../tasks/task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  username!: string;

  @Column({
    unique: true
  })
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks!: Task[];
}
