/*
  Warnings:

  - Added the required column `comment` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `comments` ADD COLUMN `comment` VARCHAR(191) NOT NULL;
