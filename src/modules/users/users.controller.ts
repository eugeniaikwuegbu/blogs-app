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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseService } from '../../helpers/responseInterceptor';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDTO } from './dto/login-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('user')
@ApiTags('User')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly baseService: BaseService,
  ) {}

  @Post()
  async registerUser(@Body() createUserDto: CreateUserDto) {
    try {
      const response = await this.usersService.registerUser(createUserDto);
      return this.baseService.transformResponse(
        'User created successfully',
        response,
        HttpStatus.CREATED,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Operation failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/login')
  async login(@Body() payload: LoginDTO) {
    try {
      const response = await this.usersService.login(payload);
      return this.baseService.transformResponse(
        'User logged in successfully',
        response,
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Operation failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Get()
  async findAll() {
    try {
      const response = await this.usersService.findAllUsers();
      return this.baseService.transformResponse(
        'Users fetched successfully',
        response,
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Operation failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const response = await this.usersService.findById(id);
      return this.baseService.transformResponse(
        'User fetched successfully',
        response,
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Operation failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const response = await this.usersService.updateUser(id, updateUserDto);
      return this.baseService.transformResponse(
        'User updated successfully',
        response,
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Operation failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      await this.usersService.deleteUser(id);
      return this.baseService.transformResponse(
        'User deleted successfully',
        {},
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Operation Failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
