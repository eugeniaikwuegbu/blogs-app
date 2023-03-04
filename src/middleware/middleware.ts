import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { UsersService } from '../modules/users/users.service';
import { UtilityService } from './../helpers/util.service';
import { IAuthenticatedReq } from './../interfaces/authenticatedRequest';

@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {
  constructor(
    @Inject(UsersService) private readonly userService: UsersService,
    @Inject(UtilityService) private readonly utilService: UtilityService,
  ) {}

  async use(req: IAuthenticatedReq, res: Response, next: NextFunction) {
    if (!req.header('authorization')) {
      throw new HttpException(
        'Authorization header not found',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const [signature, token] = req.header('authorization').split(' ');

    if (signature.toLowerCase() !== 'bearer')
      throw new HttpException(
        'Invalid token signature',
        HttpStatus.BAD_REQUEST,
      );
    if (!token)
      throw new HttpException('Token not found', HttpStatus.BAD_REQUEST);

    let user;

    const decoded: any = await this.utilService
      .verifyToken(token)
      .catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });

    user = await this.userService.findUserById(decoded.id);

    if (!user)
      throw new HttpException(
        'User from token not found',
        HttpStatus.NOT_FOUND,
      );

    req.user = user;
    return next();
  }
}
