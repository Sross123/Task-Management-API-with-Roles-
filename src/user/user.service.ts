import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // Get user by email ID
  async getUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  // Create User
  async createUser(createAuthDto: CreateAuthDto) {
    return this.prisma.user.create({
      data: createAuthDto,
    });
  }
}
