
import { HttpStatus, Injectable } from '@nestjs/common';
import { TransformResponseInterface } from '../interfaces/transform-response.interface';

@Injectable()
export class BaseService {
  public transformResponse(
    message: string,
    data: any = {},
    statusCode: number = HttpStatus.OK,
  ): TransformResponseInterface {
    return {
      statusCode,
      message,
      data,
    };
  }
}
