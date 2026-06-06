import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from '../user/user.service';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}
  async register(createAuthDto: CreateAuthDto) {
    const { email, name, password } = createAuthDto;

    const user = await this.userService.getUserByEmail(email);

    if (user) {
      throw new ConflictException('User already exists with this email');
    }

    const saltRounds = Number(this.configService.get('SALT_ROUND'));

    if (Number.isNaN(saltRounds)) {
      throw new InternalServerErrorException(
        'Invalid SALT_ROUND configuration',
      );
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const createdUser = await this.userService.createUser({
      name,
      email,
      password: hashedPassword,
    });

    const { password: _, ...userData } = createdUser;

    return {
      status: 'ok',
      message: 'User created successfully.',
      userData,
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
