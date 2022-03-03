import { ConfigService } from '@nestjs/config';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Bookmark, User } from '@prisma/client';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async create(
    bookmark: Bookmark,
    user: User,
  ): Promise<{ data: Bookmark; success: boolean }> {
    try {
      const data = await this.prisma.bookmark.create({
        data: {
          ...bookmark,
          userId: user.id,
        },
      });

      return {
        data,
        success: true,
      };
    } catch (err) {
      // if (err instanceof PrismaClientKnownRequestError) {
      //   if (err.code === 'P2002') {
      //     throw new ForbiddenException('Credentials Taken');
      //   }
      // }
      console.log(err);
    }
    // const { data, success } = await this.prisma.bookmark.create({
    //   data: {
    //     ...bookmark,

    //   }
    // });
  }
}
