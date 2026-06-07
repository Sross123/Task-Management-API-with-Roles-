import { IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  task: string;

  @IsString()
  @IsOptional()
  description: string;
}
