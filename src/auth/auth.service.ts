import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from '../user/user.service';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Role } from '../generated/prisma/client';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
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

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user?.id,
      email: user?.email,
      role: user?.role,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION'),
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
    });

    const { password: _, ...userData } = user;

    return {
      status: 'ok',
      message: 'User logged in successfully.',
      userData,
      access_token,
      refresh_token,
    };
  }

  async findAll() {
    return await this.userService.getAllUsers();
  }
}
