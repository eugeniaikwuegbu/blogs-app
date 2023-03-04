import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDTO } from './dto/login-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('user')
@ApiTags('User')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async registerUser(@Body() createUserDto: CreateUserDto) {
    const response = await this.usersService.registerUser(createUserDto);
    return { message: 'User created successfully', response };
  }

  @Post('/login')
  async login(@Body() payload: LoginDTO) {
    const response = await this.usersService.login(payload);
    return { message: 'User logged in successfully', response };
  }

  @ApiBearerAuth()
  @Get()
  async findAll() {
    const response = await this.usersService.findAllUsers();
    return { message: 'Users fetched successfully', response };
  }

  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await this.usersService.findById(id);

    return { message: 'User fetched successfully', response };
  }

  @ApiBearerAuth()
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const response = await this.usersService.updateUser(id, updateUserDto);
    return { message: 'User details updated successfully', response };
  }

  @ApiBearerAuth()
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const response = await this.usersService.deleteUser(id);
    return { message: 'User deleted successfully', response };
  }
}
