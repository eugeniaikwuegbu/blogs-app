import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as JWT from 'jsonwebtoken';

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
      return bcrypt.compare(newPassword, oldPassword);
    } catch (err) {
      throw new Error(err);
    }
  }

  generateBlogUrl(): string {
    const randomString = UtilityService.randomAlphaNumericString(9);
    return `${process.env.BASE_URL}/blog/${randomString}`;
  }
}
