import { Test, TestingModule } from '@nestjs/testing';
import { IAuthenticatedReq } from 'src/interfaces/authenticatedRequest';
import { DataSource } from 'typeorm';
import { BaseService } from '../../helpers/responseInterceptor';
import { UtilityService } from '../../helpers/util.service';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';

jest.mock('typeorm');

describe('UsersController', () => {
  let controller: BlogsController;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogsController],
      providers: [BlogsService, DataSource, UtilityService, BaseService],
    }).compile();

    controller = module.get<BlogsController>(BlogsController);
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create a Blog', () => {
    it('It create blog post', async () => {
      const data: CreateBlogDto = {
        head_line: 'Hello',
        content: 'Hello',
      };
      let request = {
        user: {
          id: '02ea766e-e22f-4841-ac04-1d999755cb4c',
          email: 'hello@hello.com',
          password: 'hello1234',
          user_name: 'eugy',
          full_name: 'EUgy',
          created_at: new Date(),
          updated_at: new Date(),
        },
      } as unknown as IAuthenticatedReq;
      jest.spyOn(dataSource, 'query').mockImplementation(async () => [
        {
          ...data,
          user: [request.user],
        },
      ]);
      const response = await controller.addBlogPost(
        request.user as unknown as IAuthenticatedReq,
        data,
      );

      console.log(response);

      // expect(response.statusCode).toEqual(HttpStatus.CREATED);
    });
  });

  describe('Find all Blogs', () => {
    it('It should find all blog posts', async () => {});
  });

  describe('Find Blog Post By Id', () => {
    it('It should throw error if blog post does not exist', async () => {});

    it('It should find blog by Id', async () => {});
  });

  describe('Update Blog', () => {
    it('It should throw error if blog with Id does not exist', async () => {});

    it('It should update blog by Id', async () => {});
  });

  describe('Delete User', () => {
    it('It should throw error if blog with Id does not exist', async () => {});

    it('It should delete blog by Id', async () => {});
  });
});
