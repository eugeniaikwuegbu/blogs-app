import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { UtilityService } from 'src/helpers/util.service';
import { DataSource } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  @InjectDataSource()
  private readonly dataSource: DataSource;

  @Inject(UtilityService)
  private readonly utilService: UtilityService;

  async registerUser(createUserDto: CreateUserDto): Promise<Partial<User>> {
    let user;
    user = await this.findOne('email', createUserDto.email);

    if (user.length > 0) {
      throw new HttpException(
        'User with email already exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await this.utilService.hashPassword(
      createUserDto.password,
    );

    user = await this.dataSource.query(
      `INSERT INTO "user" (full_name, email, user_name, password) VALUES ('${createUserDto.full_name}', '${createUserDto.email}', '${createUserDto.user_name}', '${hashedPassword}' );`,
    );

    return {
      full_name: createUserDto.full_name,
      email: createUserDto.email,
      user_name: createUserDto.user_name,
    };
  }

  async findAllUsers() {
    return await this.dataSource.query('SELECT * FROM "user";');
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

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password && updateUserDto.full_name) {
      const hashedPassword = await this.utilService.hashPassword(
        updateUserDto?.password,
      );
      await this.dataSource.query(
        `UPDATE "user" SET full_name = '${updateUserDto.full_name}',
        password = '${hashedPassword}' WHERE id = '${id}'`,
      );
    } else if (!updateUserDto?.full_name) {
      const hashedPassword = await this.utilService.hashPassword(
        updateUserDto?.password,
      );
      await this.dataSource.query(
        `UPDATE "user" SET password = '${hashedPassword}' WHERE id = '${id}'`,
      );
    } else if (!updateUserDto.password) {
      await this.dataSource.query(
        `UPDATE "user" SET full_name = '${updateUserDto.full_name}' WHERE id = '${id}'`,
      );
    }

    return await this.findById(id);
  }

  async deleteUser(id: string) {
    await this.findById(id);

    await this.dataSource.query(`DELETE FROM "user" WHERE id = '${id}'`);
  }
}
