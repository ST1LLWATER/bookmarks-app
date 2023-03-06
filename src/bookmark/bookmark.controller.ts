import { CollectionDto } from './dto/collection.dto';
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

  @Get('all')
  getAll(@GetUser() user: User) {
    return this.bookmarkService.getAll(user);
  }

  @Post('create')
  create(
    @Body() bookmark: Bookmark & { tags: string[] },
    @GetUser() user: User,
  ) {
    return this.bookmarkService.create(bookmark, user);
  }

  @Get('bookmarks')
  getBookmarks(@GetUser() user: User) {
    return this.bookmarkService.getBookmarks(user);
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

  @Post('collection/create')
  createCollection(@Body() collection: CollectionDto, @GetUser() user: User) {
    return this.bookmarkService.createCollection(collection, user);
  }

  @Post('collection/add')
  addToCollection(@Body() collectionId: number, bookmarkId: number) {
    return this.bookmarkService.addBookmarkToCollection(
      collectionId,
      bookmarkId,
    );
  }
}
