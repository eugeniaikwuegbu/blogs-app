import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { UtilityService } from 'src/helpers/util.service';
import { DataSource, In } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDTO } from './dto/login-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  @InjectDataSource()
  private readonly dataSource: DataSource;

  @Inject(UtilityService)
  private readonly utilService: UtilityService;

  async registerUser(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const user = await this.findOne('email', createUserDto.email);

    if (user.length > 0) {
      throw new HttpException(
        'User with email already exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await this.utilService.hashPassword(
      createUserDto.password,
    );

    await this.dataSource.query(
      `INSERT INTO "user" (full_name, email, user_name, password) VALUES ('${createUserDto.full_name}', '${createUserDto.email}', '${createUserDto.user_name}', '${hashedPassword}' );`,
    );

    return {
      full_name: createUserDto.full_name,
      email: createUserDto.email,
      user_name: createUserDto.user_name,
    };
  }

  async login(payload: LoginDTO) {
    const userData = await this.findOne('email', payload?.email);

    if (userData.length < 1)
      throw new HttpException(
        `User with email: ${payload?.email} does not exist`,
        HttpStatus.BAD_REQUEST,
      );

    const user = userData[0];

    const isValidPAssword = await this.utilService.checkIfPasswordIsValid(
      user.password,
      payload.password,
    );

    if (!isValidPAssword)
      throw new HttpException(
        'Incorrect email or password',
        HttpStatus.BAD_REQUEST,
      );

    delete user.password;

    const expiresIn = process.env.JWT_AUTH_TOKEN_VALIDATION_LENGTH;

    const token = await this.utilService.generateToken(
      { id: userData[0].id },
      expiresIn,
    );
    return { user: user, token };
  }

  async findAllUsers() {
    const users = await this.dataSource.query('SELECT * FROM "user";');

    users.map((user) => delete user.password);

    return users;
  }

  async findOne(searchColumn: string, searchValue: string) {
    return await this.dataSource.query(
      `SELECT * FROM "user" WHERE  ${searchColumn} = '${searchValue}'`,
    );
  }

  async findById(id: string) {
    const user = await this.dataSource.query(
      `SELECT * FROM "user" WHERE  id = '${id}'`,
    );

    if (user.length < 1) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    delete user[0].password;

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await this.utilService.hashPassword(
        updateUserDto?.password,
      );
    }

    await this.dataSource.getRepository('user').update(id, updateUserDto);
    return await this.findById(id);
  }

  async deleteUser(id: string) {
    await this.findById(id);

    // rollback blogs created by this user
    await this.dataSource.getRepository('blog').delete({ user: In([id]) });

    await this.dataSource.query(`DELETE FROM "user" WHERE id = '${id}'`);
  }
}
