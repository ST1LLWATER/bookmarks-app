import { ConfigService } from '@nestjs/config';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Bookmark, Collection, User } from '@prisma/client';

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
      console.log(err);
    }
  }

  async getAll(user: User): Promise<{
    data: { collections: Collection[]; bookmarks: Bookmark[] };
    success: boolean;
  }> {
    try {
      const collections = await this.prisma.collection.findMany({
        where: {
          userId: user.id,
        },
        include: {
          bookmarks: true,
        },
      });

      const bookmarks = await this.prisma.bookmark.findMany({
        where: {
          userId: user.id,
          collectionId: null,
        },
      });

      const data = { collections, bookmarks };

      return {
        data,
        success: true,
      };
    } catch (err) {
      console.log(err);
      return {
        data: null,
        success: false,
      };
    }
  }

  async getCollections(
    user: User,
  ): Promise<{ data: Collection[]; success: boolean }> {
    try {
      const data = await this.prisma.collection.findMany({
        where: {
          userId: user.id,
        },
        include: {
          bookmarks: true,
        },
      });

      return {
        data,
        success: true,
      };
    } catch (err) {
      console.log(err);
      return {
        data: null,
        success: false,
      };
    }
  }

  async addBookmarkToCollection(
    bookmarkId: number,
    collectionId: number,
  ): Promise<{ data: Bookmark; success: boolean }> {
    try {
      const data = await this.prisma.bookmark.update({
        where: {
          id: bookmarkId,
        },
        data: {
          collectionId,
        },
      });

      return {
        data,
        success: true,
      };
    } catch (err) {
      console.log(err);
      return {
        data: null,
        success: false,
      };
    }
  }

  async removeBookmarkFromCollection(
    bookmarkId: number,
  ): Promise<{ data: Bookmark; success: boolean }> {
    try {
      const data = await this.prisma.bookmark.update({
        where: {
          id: bookmarkId,
        },
        data: {
          collectionId: null,
        },
      });

      return {
        data,
        success: true,
      };
    } catch (err) {
      console.log(err);
      return {
        data: null,
        success: false,
      };
    }
  }

  async deleteBookmark(
    bookmarkId: number,
  ): Promise<{ data: Bookmark; success: boolean }> {
    try {
      const data = await this.prisma.bookmark.delete({
        where: {
          id: bookmarkId,
        },
      });

      return {
        data,
        success: true,
      };
    } catch (err) {
      console.log(err);
      return {
        data: null,
        success: false,
      };
    }
  }

  async deleteCollection(
    collectionId: number,
  ): Promise<{ data: Collection; success: boolean }> {
    try {
      const data = await this.prisma.collection.delete({
        where: {
          id: collectionId,
        },
      });

      return {
        data,
        success: true,
      };
    } catch (err) {
      console.log(err);
      return {
        data: null,
        success: false,
      };
    }
  }
}
