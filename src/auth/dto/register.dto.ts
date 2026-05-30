import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'willbe@test.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'willbe', minLength: 6 })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password!: string;
}
