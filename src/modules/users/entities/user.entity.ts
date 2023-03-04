import * as bcrypt from 'bcryptjs';
import { BaseModel } from 'src/models/baseModel';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

@Entity('user')
export class User extends BaseModel {
  @Column({ length: 255 })
  full_name: string;

  @Column({ length: 255, nullable: false, unique: true })
  email: string;

  @Column({ length: 20, nullable: false, unique: true })
  user_name: string;

  @Column({ length: 255 })
  password: string;

  @Column()
  is_valid_password: boolean;

  @BeforeUpdate()
  @BeforeInsert()
  async hashPassword(next) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  }

  @BeforeInsert()
  checkIfPasswordIsValid(password): Boolean {
    try {
      const storedPassword = password || '';
      return this.is_valid_password = bcrypt.compare(password, storedPassword);
    } catch (err) {
      throw new Error(err);
    }
  }
}
