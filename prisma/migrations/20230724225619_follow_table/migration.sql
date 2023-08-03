/*
  Warnings:

  - You are about to drop the `followers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `following` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `followers` DROP FOREIGN KEY `followers_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `following` DROP FOREIGN KEY `following_user_id_fkey`;

-- DropTable
DROP TABLE `followers`;

-- DropTable
DROP TABLE `following`;

-- CreateTable
CREATE TABLE `follows` (
    `following_user_id` VARCHAR(191) NOT NULL,
    `followed_user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`following_user_id`, `followed_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `follows` ADD CONSTRAINT `follows_following_user_id_fkey` FOREIGN KEY (`following_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `follows` ADD CONSTRAINT `follows_followed_user_id_fkey` FOREIGN KEY (`followed_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
