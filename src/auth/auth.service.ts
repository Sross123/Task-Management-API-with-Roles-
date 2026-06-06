import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from '../user/user.service';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Role } from '../generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    const { email, name, password, role } = createAuthDto;

    const user = await this.userService.getUserByEmail(email);

    if (user) {
      throw new ConflictException('User already exists with this email');
    }

    // Default to 10 rounds if configuration is missing or invalid
    const saltRounds = Number(this.configService.get('SALT_ROUND') ?? 10);
    const validatedSaltRounds = Number.isNaN(saltRounds) ? 10 : saltRounds;

    const hashedPassword = await bcrypt.hash(password, validatedSaltRounds);

    // Map role correctly matching Prisma enum (defaulting to USER)
    const mappedRole = role ? (role.toUpperCase() as Role) : Role.USER;

    const createdUser = await this.userService.createUser({
      name,
      email,
      password: hashedPassword,
      role: mappedRole,
    });

    const { password: _, ...userData } = createdUser;

    return {
      status: 'ok',
      message: 'User created successfully.',
      userData,
    };
  }
}
