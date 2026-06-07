import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from 'src/generated/prisma/enums';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createTaskDto: CreateTaskDto, userId: number) {
    return await this.prisma.task.create({
      data: {
        task: createTaskDto.task,
        description: createTaskDto.description,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findAll(role: string, userId: number) {
    if (role === Role.ADMIN) {
      return await this.prisma.task.findMany();
    } else {
      return await this.prisma.task.findMany({ where: { userId } });
    }
  }

  async findOne(id: number, role: string, userId: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task #${id} not found`);
    }
    if (role !== Role.ADMIN && task.userId !== userId) {
      throw new ForbiddenException('You do not have access to this task');
    }
    return task;
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    role: string,
    userId: number,
  ) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task #${id} not found`);
    }
    if (role !== Role.ADMIN && task.userId !== userId) {
      throw new ForbiddenException('You do not have access to this task');
    }
    return await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: number, role: string, userId: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task #${id} not found`);
    }
    if (role !== Role.ADMIN && task.userId !== userId) {
      throw new ForbiddenException('You do not have access to this task');
    }
    return await this.prisma.task.delete({ where: { id } });
  }
}
