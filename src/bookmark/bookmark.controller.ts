import { JwtGuard } from './../auth/guard';
import { BookmarkService } from './bookmark.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Bookmark, User } from '@prisma/client';
import { GetUser } from '../auth/decorators';

@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post('create')
  create(@Body() bookmark: Bookmark, @GetUser() user: User) {
    return this.bookmarkService.create(bookmark, user);
  }

  @Get('all')
  getAll(@GetUser() user: User) {
    return this.bookmarkService.getAll(user);
  }
}
