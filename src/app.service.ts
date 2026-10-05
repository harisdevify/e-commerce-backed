import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): String {
    return 'Wellcome to Nest JS Web Application Backend';
  }
}
