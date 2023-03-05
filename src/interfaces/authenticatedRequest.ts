import { Request } from 'express';
import { User } from '../modules/users/entities/user.entity';

export interface IAuthenticatedReq extends Request {
  user: User;
}
