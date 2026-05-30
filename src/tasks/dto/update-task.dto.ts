import { IsEnum } from 'class-validator';

import { TaskStatus } from '../enums/task-status.enum';

export class UpdateTaskDto {
  @IsEnum(TaskStatus)
  status!: TaskStatus;
}
