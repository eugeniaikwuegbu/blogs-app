import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilityService } from 'src/helpers/util.service';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { Blog } from './entities/blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Blog])],
  controllers: [BlogsController],
  providers: [BlogsService, UtilityService],
})
export class BlogsModule {}
