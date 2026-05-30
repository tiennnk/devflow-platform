import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';

import { EventsModule } from '../events/events.module';
import { BullModule } from '@nestjs/bullmq';
import { TasksProcessor } from 'src/tasks/tasks.processor';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), EventsModule, BullModule.registerQueue({ name: 'tasks' })],
  controllers: [TasksController],
  providers: [TasksService, TasksProcessor]
})
export class TasksModule {}
