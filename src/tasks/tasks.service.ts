import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectQueue('tasks')
    private readonly tasksQueue: Queue,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger
  ) {}

  async getTasks(userId: number): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      where: { user: { id: userId } }
    });

    return tasks;
  }

  async getTaskById(id: number, userId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: { user: true }
    });

    if (!task) {
      this.logger.error(`Task #${id} not found`);
      throw new NotFoundException(`Task #${id} not found`);
    }

    if (task.user.id !== userId) {
      throw new ForbiddenException(`You do not have access to task #${id}`);
    }

    return task;
  }

  async createTask(body: CreateTaskDto, userId: number): Promise<Task> {
    const newTask = this.taskRepository.create({
      title: body.title,
      user: { id: userId }
    });
    if (body.status) newTask.status = body.status;

    const savedTask = await this.taskRepository.save(newTask);
    await this.tasksQueue.add('task:created', savedTask);

    this.logger.log('info', `Task created: ${savedTask.id} by user ${userId}`);

    return savedTask;
  }

  async updateTask(id: number, body: UpdateTaskDto, userId: number): Promise<Task> {
    const task = await this.getTaskById(id, userId);

    task.title = body.title ?? task.title;
    task.status = body.status ?? task.status;

    const saved = await this.taskRepository.save(task);
    await this.tasksQueue.add('task:updated', saved);

    return saved;
  }

  async deleteTask(id: number, userId: number): Promise<void> {
    const task = await this.getTaskById(id, userId);
    await this.taskRepository.remove(task);
    await this.tasksQueue.add('task:deleted', { id });
    this.logger.log('info', `Task deleted: ${id}`);
  }
}
