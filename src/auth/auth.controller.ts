import { Controller, Post, Body, UseInterceptors, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoggingInterceptor } from '../logging.interceptor';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guards';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorator/roles.decorator';
import { Role } from 'src/generated/prisma/enums';

@Controller('auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) { 
    return this.authService.login(loginDto)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Get('users')
  findAll() {
    return this.authService.findAll();
  }
}

