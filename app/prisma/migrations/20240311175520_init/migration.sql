/*
  Warnings:

  - Made the column `ownerId` on table `images` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `save` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `images` MODIFY `ownerId` VARCHAR(80) NOT NULL;

-- AlterTable
ALTER TABLE `save` MODIFY `user_id` VARCHAR(80) NOT NULL;

-- AlterTable
ALTER TABLE `worlds` MODIFY `ownerId` VARCHAR(191) NOT NULL;
