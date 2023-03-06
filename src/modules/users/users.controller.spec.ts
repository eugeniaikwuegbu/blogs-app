import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { validate } from 'class-validator';
import { DataSource } from 'typeorm';
import { BaseService } from '../../helpers/responseInterceptor';
import { UtilityService } from '../../helpers/util.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

jest.mock('jsonwebtoken');
jest.mock('typeorm');
jest.mock('bcryptjs');

describe('UsersController', () => {
  let controller: UsersController;
  let dataSource: jest.Mocked<DataSource>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, DataSource, UtilityService, BaseService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    dataSource = module.get<DataSource>(DataSource) as jest.Mocked<DataSource>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create User', () => {
    it('It should throw a validation error if user enters an invalid email address', async () => {
      const data: CreateUserDto = {
        full_name: 'Kel',
        email: 'hello.com',
        user_name: 'hi',
        password: 'hello1234',
      };

      const signUpDto = Object.assign(new CreateUserDto(), data);

      const validateError = await validate(signUpDto);

      expect(validateError.length).toEqual(1);
    });

    it('It should throw a validation error if user does not enter required fields', async () => {
      const data: CreateUserDto = {
        full_name: '',
        email: '',
        user_name: 'hi',
        password: 'hello1234',
      };
      const signUpDto = Object.assign(new CreateUserDto(), data);

      const validateError = await validate(signUpDto);

      expect(validateError.length).toBeGreaterThan(0);
    });

    it('It should throw a error if user with email already exist', async () => {
      const data = {
        email: 'hello@hello.com',
        password: 'hello1234',
      } as CreateUserDto;

      try {
        jest.spyOn(dataSource, 'query').mockImplementation(async () => [data]);

        await controller.registerUser(data);
      } catch (error) {
        expect(error.name).toBe('HttpException');
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });

    it('It should create a user if user does not exist', async () => {
      const data: CreateUserDto = {
        email: 'hello@hello.com',
        password: 'hello1234',
        user_name: 'eugy',
        full_name: 'EUgy',
      };
      jest.spyOn(dataSource, 'query').mockImplementation(async () => []);
      const response = await controller.registerUser(data);

      expect(response.statusCode).toEqual(HttpStatus.CREATED);
    });
  });


  describe('Find all Users', () => {
    it('It should find all users', async () => {
      const data = {
        email: 'hello@hello.com',
        user_name: 'eugy',
        full_name: 'Eugy',
      };
      jest.spyOn(dataSource, 'query').mockImplementation(async () => [data]);
      const response = await controller.findAll();

      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response.data).toBeInstanceOf(Array);
    });
  });

  describe('Find User By Id', () => {
    it('It should throw error if user does not exist', async () => {
      try {
        jest.spyOn(dataSource, 'query').mockImplementation(async () => []);

        await controller.findOne('02ea766e-e22f-4841-ac04-1d999755cb4c');
      } catch (error) {
        expect(error.name).toBe('HttpException');
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });

    it('It should find user by Id', async () => {
      const data = {
        id: '02ea766e-e22f-4841-ac04-1d999755cb4c',
        email: 'hello@hello.com',
        user_name: 'eugy',
        full_name: 'Eugy',
      };
      jest.spyOn(dataSource, 'query').mockImplementation(async () => [data]);

      const response = await controller.findOne(data.id);

      expect(response.statusCode).toEqual(HttpStatus.OK);
    });
  });
});
