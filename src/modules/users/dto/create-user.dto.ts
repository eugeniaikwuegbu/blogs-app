import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: "User's full name",
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiProperty({
    example: 'hello@gmail.com',
    description: 'Email address of the user',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase())
  email: string

  @ApiProperty({
    example: 'johndoe',
    description: 'Username of the user',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  user_name: string;

  @ApiProperty({
    example: 'hello@!#23',
    description: "User's password",
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
