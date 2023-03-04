import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as JWT from 'jsonwebtoken';
import { IPaginatedRes } from 'src/interfaces/pagination';

const randomstring = require('randomstring');

@Injectable()
export class UtilityService {
  static randomAlphaNumericString = (length: number) => {
    return randomstring.generate({
      length,
      charset: 'alphanumeric',
    });
  };

  generateToken = async (
    data: Record<string, any>,
    expiresIn?: string,
    secretKey?: string,
  ): Promise<string> => {
    const key = secretKey || process.env.JWT_SECRET_KEY;
    const expire = expiresIn || process.env.JWT_AUTH_TOKEN_VALIDATION_LENGTH;
    return JWT.sign(data, key, { expiresIn: expire });
  };

  verifyToken = async (token: string, secretKey?: string): Promise<any> => {
    return JWT.verify(token, secretKey || process.env.JWT_SECRET_KEY);
  };

  decodeJWT = async (token: string): Promise<any> => {
    return JWT.decode(token, { complete: true });
  };

  hashPassword = async (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hash(password, salt);
  };

  checkIfPasswordIsValid(oldPassword, newPassword): Boolean {
    try {
      const storedPassword = oldPassword || '';
      return bcrypt.compare(newPassword, storedPassword);
    } catch (err) {
      throw new Error(err);
    }
  }

  paginate = (
    data: any[],
    total: number,
    perPage: number,
    pageNumber: number,
  ): IPaginatedRes => {
    return {
      data,
      pagination: {
        total,
        perPage,
        pageNumber,
        pageSize: data.length,
      },
    };
  };
}
