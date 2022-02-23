import { Injectable } from '@nestjs/common';

@Injectable({})
export class UserService {
  getMe() {
    return {
      id: 1,
      name: 'John Doe',
      email: 'email@gmail.com',
    };
  }
}
