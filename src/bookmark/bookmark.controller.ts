import { JwtGuard } from './../auth/guard';
import { BookmarkService } from './bookmark.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Bookmark, User } from '@prisma/client';
import { GetUser } from '../auth/decorators';

@UseGuards(JwtGuard)
@Controller('bookmarks')
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

  @Patch('update')
  update(@Body() bookmark: Bookmark) {
    return this.bookmarkService.updateBookmark(bookmark);
  }

  @Delete('delete')
  delete(@Body() bookmarkId: number) {
    return this.bookmarkService.deleteBookmark(bookmarkId);
  }

  @Get('collections')
  getCollections(@GetUser() user: User) {
    return this.bookmarkService.getCollections(user);
  }

  @Post('collection/add')
  addToCollection(@Body() collectionId: number, bookmarkId: number) {
    return this.bookmarkService.addBookmarkToCollection(
      collectionId,
      bookmarkId,
    );
  }
}
