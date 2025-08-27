/*
  Warnings:

  - Added the required column `name` to the `TableColumn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `TableColumn` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."TableColumn" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "type" "public"."TableCellType" NOT NULL;
