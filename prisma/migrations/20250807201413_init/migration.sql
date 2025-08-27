-- CreateEnum
CREATE TYPE "public"."TableCellType" AS ENUM ('TEXT', 'NUMBER', 'BOOLEAN', 'DATE');

-- CreateTable
CREATE TABLE "public"."Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Table" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "Table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TableRow" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tableId" TEXT NOT NULL,

    CONSTRAINT "TableRow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TableColumn" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tableId" TEXT NOT NULL,

    CONSTRAINT "TableColumn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TableCell" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tableRowId" TEXT NOT NULL,
    "tableColumnId" TEXT NOT NULL,
    "value" TEXT,

    CONSTRAINT "TableCell_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Workspace_name_idx" ON "public"."Workspace"("name");

-- CreateIndex
CREATE INDEX "Table_name_idx" ON "public"."Table"("name");

-- CreateIndex
CREATE INDEX "TableRow_tableId_idx" ON "public"."TableRow"("tableId");

-- CreateIndex
CREATE INDEX "TableColumn_tableId_idx" ON "public"."TableColumn"("tableId");

-- CreateIndex
CREATE INDEX "TableCell_tableRowId_idx" ON "public"."TableCell"("tableRowId");

-- AddForeignKey
ALTER TABLE "public"."Table" ADD CONSTRAINT "Table_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TableRow" ADD CONSTRAINT "TableRow_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "public"."Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TableColumn" ADD CONSTRAINT "TableColumn_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "public"."Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TableCell" ADD CONSTRAINT "TableCell_tableRowId_fkey" FOREIGN KEY ("tableRowId") REFERENCES "public"."TableRow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TableCell" ADD CONSTRAINT "TableCell_tableColumnId_fkey" FOREIGN KEY ("tableColumnId") REFERENCES "public"."TableColumn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
