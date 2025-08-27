import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const workspaceRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.workspace.create({
        data: {
          name: input.name,
        },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.workspace.findMany();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.workspace.findUnique({
        where: { id: input.id },
      });
    }),

  seedWorkspace: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // check if workspace has tables
      const tables = await ctx.db.table.findMany({
        where: { workspaceId: input.id },
      });

      if (tables[0]) {
        return tables[0];
      }
      // seed tables
      const new_table = await ctx.db.table.create({
        data: {
          name: "Table 1",
          workspaceId: input.id,
        },
      });

      // create new columns
      await ctx.db.tableColumn.createMany({
        data: [
          { name: "Column 1", tableId: new_table.id, type: "TEXT" },
          { name: "Column 2", tableId: new_table.id, type: "TEXT" },
          { name: "Column 3", tableId: new_table.id, type: "TEXT" },
        ],
      });

      // create new rows
      await ctx.db.tableRow.createMany({
        data: Array.from({ length: 10 }, () => ({ tableId: new_table.id })),
      });

      return new_table;
    }),

  getWorkspaceForTableContext: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.workspace.findUnique({
        where: { id: input.id },
        include: {
          tables: true,
        },
      });
    }),

  update: publicProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.workspace.update({
        where: { id: input.id },
        data: { name: input.name },
      });
    }),
});
