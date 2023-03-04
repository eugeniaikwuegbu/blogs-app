import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('User')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const response = await this.usersService.registerUser(createUserDto);
    return { message: 'User created successfully', response };
  }

  @Get()
  async findAll() {
    const response = await this.usersService.findAllUsers();
    return { message: 'Users fetched successfully', response };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await this.usersService.findById(id);

    return { message: 'User fetched successfully', response };
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const response = await this.usersService.updateUser(id, updateUserDto);
    console.log(response);
    return { message: 'User details updated successfully', response };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const response = await this.usersService.deleteUser(id);
    return { message: 'User deleted successfully', response };
  }
}
