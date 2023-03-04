import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    example: 'Nigerian Elections',
    description: 'The head line for the blog post',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  head_line: string;

  @ApiProperty({
    example: 'Nigerian Elections was held on Feb 25, 2023',
    description: 'The content of the blog post',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  content: string;
}
