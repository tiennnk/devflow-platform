import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'testWillbe' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ example: 'willbe.test@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'testwillbe', minLength: 6 })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password!: string;
}
