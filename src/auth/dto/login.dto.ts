import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'testWillbe or willbe.test@gmail.com' })
  @IsString()
  @IsNotEmpty()
  usernameOrEmail!: string;

  @ApiProperty({ example: 'testwillbe' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
