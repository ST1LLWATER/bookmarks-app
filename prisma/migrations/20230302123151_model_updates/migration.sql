/*
  Warnings:

  - You are about to drop the column `link` on the `bookmarks` table. All the data in the column will be lost.
  - Added the required column `url` to the `bookmarks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookmarks" DROP COLUMN "link",
ADD COLUMN     "url" TEXT NOT NULL;
