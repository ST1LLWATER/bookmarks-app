import { Bookmark } from '@prisma/client';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable({})
export class UserService {
  constructor(private PrismaService: PrismaService) {}

  getMe() {
    return {
      id: 1,
      name: 'John Doe',
      email: 'email@gmail.com',
    };
  }
}
