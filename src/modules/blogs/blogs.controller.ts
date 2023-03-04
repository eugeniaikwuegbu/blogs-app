import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IAuthenticatedReq } from 'src/interfaces/authenticatedRequest';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blog')
@ApiTags('Blog')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @ApiBearerAuth()
  @Post()
  async addBlogPost(
    @Req() request: IAuthenticatedReq,
    @Body() payload: CreateBlogDto,
  ) {
    const response = await this.blogsService.createBlogPost(
      request?.user[0],
      payload,
    );
    return { message: 'Blog added successfully', response };
  }

  @ApiBearerAuth()
  @Get()
  async findAllPosts() {
    const response = await this.blogsService.findAllBlogs();
    return { message: 'Blogs fetched successfully', response };
  }

  @ApiBearerAuth()
  @Get(':id')
  async findBlogById(@Param('id') id: string) {
    const response = await this.blogsService.findById(id);
    return { message: 'Blog fetched successfully', response };
  }

  @ApiBearerAuth()
  @Patch(':id')
  async updateBlog(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    const response = await this.blogsService.updateBlogPost(id, updateBlogDto);
    return { message: 'Blog Updated successfully', response };
  }

  @ApiBearerAuth()
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    const response = await this.blogsService.deletePost(id);
    return { message: 'Blog post deleted successfully', response };
  }
}
