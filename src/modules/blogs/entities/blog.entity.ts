import { UtilityService } from 'src/helpers/util.service';
import { BaseModel } from 'src/models/baseModel';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('blog')
export class Blog extends BaseModel {
  @Column()
  head_line: string;

  @Column()
  content: string;

  @Column()
  is_published: boolean;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  @JoinColumn()
  user: User;

  @Column()
  blog_url: string;

  @BeforeInsert()
  generateBlogUrl() {
    console.log('here');

    const randomString = UtilityService.randomAlphaNumericString(9);
    this.blog_url = `${process.env.BASE_URL}/blog/${randomString}`;
  }
}
