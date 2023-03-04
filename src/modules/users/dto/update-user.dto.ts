import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: "User's full name",
    required: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  full_name: string;

  @ApiProperty({
    example: 'hello@!#23',
    description: "User's password",
    required: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  password: string;
}
