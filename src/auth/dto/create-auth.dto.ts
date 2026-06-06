import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsStrongPassword(
    { minUppercase: 1, minLength: 8, minSymbols: 1 },
    {
      message:
        'Password must be at least 8 characters long and contain at least one uppercase letter and one symbol.',
    },
  )
  password!: string;
}
