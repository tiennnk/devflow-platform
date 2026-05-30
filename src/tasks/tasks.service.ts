import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectQueue('tasks')
    private readonly tasksQueue: Queue
  ) {}

  async getTasks(userId: number): Promise<Task[]> {
    const tasks = await this.taskRepository.find({ where: { user: { id: userId } } });

    return tasks;
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException(`Task #${id} not found`);
    }

    return task;
  }

  async createTask(body: CreateTaskDto, userId: number): Promise<Task> {
    const newTask = this.taskRepository.create({ title: body.title, user: { id: userId } });

    const savedTask = await this.taskRepository.save(newTask);
    await this.tasksQueue.add('task:created', savedTask);

    return savedTask;
  }

  async updateTask(id: number, body: UpdateTaskDto): Promise<Task> {
    const task = await this.getTaskById(id);

    task.status = body.status;

    return this.taskRepository.save(task);
  }
}
