import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UtilityService } from '../../helpers/util.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogsService {
  @InjectDataSource()
  private readonly dataSource: DataSource;

  @Inject(UtilityService)
  private readonly utilService: UtilityService;

  async createBlogPost(
    user,
    createBlogDto: CreateBlogDto,
  ): Promise<Partial<Blog>> {
    const blog_url = this.utilService.generateBlogUrl();
    await this.dataSource.query(
      `INSERT INTO "blog" (head_line, content, is_published, blog_url, "userId") VALUES ('${createBlogDto.head_line}', '${createBlogDto.content}', true, '${blog_url}', '${user.id}' );`,
    );

    delete user.password;

    return {
      head_line: createBlogDto.head_line,
      content: createBlogDto.content,
      is_published: true,
      blog_url: blog_url,
      user: user,
    };
  }

  async findAllBlogs() {
    return await this.dataSource.query('SELECT * FROM "blog";');
  }

  async findOne(searchColumn: string, searchValue: string) {
    return await this.dataSource.query(
      `SELECT * FROM "blog" WHERE  ${searchColumn} = '${searchValue}'`,
    );
  }

  async findById(id: string) {
    const blog = await this.dataSource.query(
      `SELECT * FROM "blog" WHERE  id = '${id}'`,
    );

    if (blog.length < 1) {
      throw new HttpException(
        'Blog post does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    return blog;
  }

  async updateBlogPost(id: string, payload: UpdateBlogDto) {
    await this.dataSource.getRepository('blog').update(id, payload);
    const update = await this.findById(id);
    update[0].updated_at = new Date();
    return update;
  }
  async deletePost(id: string) {
    await this.findById(id);
    await this.dataSource.query(`DELETE FROM "blog" WHERE id = '${id}'`);
  }
}
