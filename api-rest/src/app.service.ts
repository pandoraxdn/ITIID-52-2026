import {Injectable} from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      saludo: "Hola mundo desde nestjs"
    };
  }
}
