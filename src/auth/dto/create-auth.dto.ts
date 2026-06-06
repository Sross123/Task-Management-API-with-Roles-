import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsStrongPassword(
    { minUppercase: 1, minLength: 8, minSymbols: 1 },
    {
      message:
        'Password must be at least 8 characters long and contain at least one uppercase letter and one symbol.',
    },
  )
  password!: string;

  @IsString()
  @IsOptional()
  @IsIn(["USER", 'ADMIN'])
  role!: string;
}
