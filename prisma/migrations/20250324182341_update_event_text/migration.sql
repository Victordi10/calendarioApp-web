/*
  Warnings:

  - You are about to drop the column `cycle` on the `Event` table. All the data in the column will be lost.
  - Added the required column `type` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Event` DROP COLUMN `cycle`,
    ADD COLUMN `type` VARCHAR(191) NOT NULL,
    MODIFY `text` TEXT NOT NULL;
