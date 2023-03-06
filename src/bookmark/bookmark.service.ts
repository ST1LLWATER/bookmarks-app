import { ConfigService } from '@nestjs/config';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Bookmark, Collection, User } from '@prisma/client';
import { CollectionDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async create(
    bookmark: Bookmark & { tags: string[] },
    user: User,
  ): Promise<{ data: Bookmark; success: boolean }> {
    try {
      const { tags, ...bookmarkPayload } = bookmark;
      const data = await this.prisma.bookmark.create({
        data: {
          ...bookmarkPayload,
          userId: user.id,
        },
      });

      if (tags.length > 0) {
        const tagPayload = tags.map((tag) => ({
          tag: tag.toLocaleLowerCase(),
          bookmarkId: data.id,
        }));

        await this.prisma.tag.createMany({
          data: tagPayload,
        });
      }

      return {
        data,
        success: true,
      };
    } catch (err) {
      console.log(err);
    }
  }

  async getBookmarks(
    user: User,
  ): Promise<{ data: Bookmark[]; success: boolean }> {
    try {
      const data = await this.prisma.bookmark.findMany({
        where: {
          userId: user.id,
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

  async updateBookmark(
    bookmark: Bookmark,
  ): Promise<{ data: Bookmark; success: boolean }> {
    try {
      const data = await this.prisma.bookmark.update({
        where: {
          id: bookmark.id,
        },
        data: {
          ...bookmark,
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

  async createCollection(
    collection: CollectionDto,
    user: User,
  ): Promise<{ data: Collection; success: boolean }> {
    try {
      const data = await this.prisma.collection.create({
        data: {
          ...collection,
          userId: user.id,
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
