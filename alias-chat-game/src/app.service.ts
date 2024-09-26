import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Node.js-Based Game "Alias" with Chat and Word Checking';
  }
}
