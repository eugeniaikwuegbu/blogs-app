import { BaseModel } from 'src/models/baseModel';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('blog')
export class Blog extends BaseModel {
  @Column()
  head_line: string;

  @Column()
  content: string;

  @Column({ default: false })
  is_published: boolean;

  @Column({ nullable: false, unique: true })
  blog_url: string;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  @JoinColumn()
  user: User;
}
