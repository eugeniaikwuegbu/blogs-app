import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilityService } from './helpers/util.service';
import { VerifyTokenMiddleware } from './middleware/middleware';
import { BlogsController } from './modules/blogs/blogs.controller';
import { BlogsModule } from './modules/blogs/blogs.module';
import { Blog } from './modules/blogs/entities/blog.entity';
import { User } from './modules/users/entities/user.entity';
import { UsersController } from './modules/users/users.controller';
import { UsersModule } from './modules/users/users.module';
import { UsersService } from './modules/users/users.service';
require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      entities: [User, Blog],
      synchronize: true,
    }),
    UsersModule,
    BlogsModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersService, UtilityService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .exclude(
        { path: '/user', method: RequestMethod.POST },
        { path: '/user/login', method: RequestMethod.POST },
      )
      .forRoutes(BlogsController, UsersController);
  }
}
