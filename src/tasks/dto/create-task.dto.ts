import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Fix bug' })
  @IsString()
  @IsNotEmpty()
  title!: string;
}
