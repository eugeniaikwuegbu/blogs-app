import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseService } from '../../helpers/responseInterceptor';
import { IAuthenticatedReq } from '../../interfaces/authenticatedRequest';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blog')
@ApiTags('Blog')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly baseService: BaseService,
  ) {}

  @ApiBearerAuth()
  @Post()
  async addBlogPost(
    @Req() request: IAuthenticatedReq,
    @Body() payload: CreateBlogDto,
  ) {
    try {
      const response = await this.blogsService.createBlogPost(
        request?.user[0],
        payload,
      );
      return this.baseService.transformResponse(
        'Blog added successfully',
        response,
        HttpStatus.CREATED,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Operation Failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Get()
  async findAllPosts() {
    try {
      const response = await this.blogsService.findAllBlogs();
      return this.baseService.transformResponse(
        'Blogs fetched successfully',
        response,
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Operation Failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Get(':id')
  async findBlogById(@Param('id') id: string) {
    try {
      const response = await this.blogsService.findById(id);
      return this.baseService.transformResponse(
        'Blog fetched successfully',
        response,
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Operation Failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Patch(':id')
  async updateBlog(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    try {
      const response = await this.blogsService.updateBlogPost(
        id,
        updateBlogDto,
      );
      return this.baseService.transformResponse(
        'Blog Updated successfully',
        response,
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Operation Failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    try {
      await this.blogsService.deletePost(id);
      return this.baseService.transformResponse(
        'Blog post deleted successfully',
        {},
        HttpStatus.OK,
      );
      return { message: '' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Operation Failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
