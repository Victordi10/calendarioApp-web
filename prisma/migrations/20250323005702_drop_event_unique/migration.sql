/*
  Warnings:

  - You are about to drop the column `date` on the `Event` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Event_date_key` ON `Event`;

-- AlterTable
ALTER TABLE `Event` DROP COLUMN `date`;
