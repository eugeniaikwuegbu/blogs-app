import { BaseModel } from 'src/models/baseModel';
import { Column, Entity } from 'typeorm';

@Entity('user')
export class User extends BaseModel {
  @Column({ length: 255 })
  full_name: string;

  @Column({ length: 255, nullable: false, unique: true })
  email: string;

  @Column({ length: 20, nullable: false })
  user_name: string;

  @Column({ length: 255 })
  password: string;
}
