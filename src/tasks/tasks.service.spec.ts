import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private tasks = [
    {
      id: 1,
      title: 'Setup NestJS project',
      status: 'DONE'
    }
  ];

  getTasks() {
    return this.tasks;
  }

  createTask(body: CreateTaskDto) {
    const newTask = {
      id: this.tasks.length + 1,
      title: body.title,
      status: 'TODO'
    };

    this.tasks.push(newTask);

    return newTask;
  }

  getTaskById(id: number) {
    return this.tasks.find((task) => task.id === id);
  }
}
