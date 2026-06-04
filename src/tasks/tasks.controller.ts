import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('tasks')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Get all tasks' })
  @Get()
  getTasks(@CurrentUser() user: { userId: number }) {
    return this.tasksService.getTasks(user.userId);
  }

  @ApiOperation({ summary: 'Get task by ID' })
  @Get(':id')
  getTaskById(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { userId: number }) {
    return this.tasksService.getTaskById(id, user.userId);
  }

  @ApiOperation({ summary: 'Create a new task' })
  @Post()
  createTask(@Body() body: CreateTaskDto, @CurrentUser() user: { userId: number }) {
    return this.tasksService.createTask(body, user.userId);
  }

  @ApiOperation({ summary: 'Update task' })
  @Patch(':id')
  updateTask(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTaskDto, @CurrentUser() user: { userId: number }) {
    return this.tasksService.updateTask(id, body, user.userId);
  }

  @ApiOperation({ summary: 'Delete task' })
  @Delete(':id')
  @HttpCode(204)
  deleteTask(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { userId: number }) {
    return this.tasksService.deleteTask(id, user.userId);
  }
}
