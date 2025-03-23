/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Project` DROP FOREIGN KEY `Project_ownerId_fkey`;

-- DropIndex
DROP INDEX `Project_ownerId_fkey` ON `Project`;

-- AlterTable
ALTER TABLE `Event` ADD COLUMN `date` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Project` ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `idealClient` VARCHAR(191) NULL,
    ADD COLUMN `longTermGoals` VARCHAR(191) NULL,
    ADD COLUMN `mediumTermGoals` VARCHAR(191) NULL,
    ADD COLUMN `shortTermGoals` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Event_date_key` ON `Event`(`date`);

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
