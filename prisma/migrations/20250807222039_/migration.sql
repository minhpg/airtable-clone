/*
  Warnings:

  - A unique constraint covering the columns `[tableId,tableRowId,tableColumnId]` on the table `TableCell` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TableCell_tableId_tableRowId_tableColumnId_key" ON "public"."TableCell"("tableId", "tableRowId", "tableColumnId");
