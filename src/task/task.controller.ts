import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import type { Request } from 'express';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @UseGuards(AuthGuard)
  @Post('create')
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.taskService.create(createTaskDto, userId);
  }

  @Get('get-all-tasks')
  @UseGuards(AuthGuard)
  findAll(@Req() req: Request) {
    const userId = (req as any).user.sub;
    const role = (req as any).user.role;
    return this.taskService.findAll(role, userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).user.sub;
    const role = (req as any).user.role;
    return this.taskService.findOne(+id, role, userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Req() req: Request) {
    const userId = (req as any).user.sub;
    const role = (req as any).user.role;
    return this.taskService.update(+id, updateTaskDto, role, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).user.sub;
    const role = (req as any).user.role;
    return this.taskService.remove(+id, role, userId);
  }
}
