import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { faker } from "@faker-js/faker";

export const tableRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string().min(1), workspaceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.table.create({
        data: {
          name: input.name,
          workspaceId: input.workspaceId,
        },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.table.findMany();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.table.findUnique({
        where: { id: input.id },
      });
    }),

  getTableColumns: publicProcedure
    .input(z.object({ tableId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.tableColumn.findMany({
        where: { tableId: input.tableId },
      });
    }),

  getTableRows: publicProcedure
    .input(z.object({ tableId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.tableRow.findMany({
        where: { tableId: input.tableId },
      });
    }),

  getTableCells: publicProcedure
    .input(z.object({ tableId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.tableCell.findMany({
        where: { tableId: input.tableId },
      });
    }),

  update: publicProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.table.update({
        where: { id: input.id },
        data: { name: input.name },
      });
    }),

  addColumn: publicProcedure
    .input(z.object({ tableId: z.string(), name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tableColumn.create({
        data: { tableId: input.tableId, name: input.name, type: "TEXT" },
      });
    }),

  updateColumn: publicProcedure
    .input(
      z.object({
        tableId: z.string(),
        columnId: z.string(),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tableColumn.update({
        where: { id: input.columnId },
        data: { name: input.name },
      });
    }),

  deleteColumn: publicProcedure
    .input(z.object({ tableId: z.string(), columnId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tableColumn.delete({
        where: { id: input.columnId },
      });
    }),

  addRow: publicProcedure
    .input(z.object({ tableId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tableRow.create({
        data: { tableId: input.tableId },
      });
    }),

  deleteRow: publicProcedure
    .input(z.object({ tableId: z.string(), tableRowId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tableRow.delete({
        where: { id: input.tableRowId },
      });
    }),

  updateCell: publicProcedure
    .input(
      z.object({
        tableId: z.string(),
        tableRowId: z.string(),
        tableColumnId: z.string(),
        value: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tableCell.upsert({
        where: {
          tableId_tableRowId_tableColumnId: {
            tableId: input.tableId,
            tableRowId: input.tableRowId,
            tableColumnId: input.tableColumnId,
          },
        },
        update: { value: input.value },
        create: {
          tableId: input.tableId,
          tableRowId: input.tableRowId,
          tableColumnId: input.tableColumnId,
          value: input.value,
        },
      });
    }),

  seedTable: publicProcedure
    .input(z.object({ tableId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const columns = await ctx.db.tableColumn.findMany({
        where: { tableId: input.tableId },
      });

      // create rows
      await ctx.db.tableRow.createMany({
        data: Array.from({ length: 1000 }).map((_, i) => ({
          tableId: input.tableId,
        })),
      });

      // get all rows
      const rows = await ctx.db.tableRow.findMany({
        where: { tableId: input.tableId },
      });

      const cells = rows.map((row) => {
        return columns.map((column) => ({
          tableId: input.tableId,
          tableRowId: row.id,
          tableColumnId: column.id,
          value: faker.lorem.words({ min: 5, max: 20 }),
        }));
      });

      // create cells
      await ctx.db.tableCell.createMany({
        data: cells.flat(),
        skipDuplicates: true,
      });
    }),
});
