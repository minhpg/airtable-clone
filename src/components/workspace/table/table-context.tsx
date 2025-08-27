import { Checkbox } from "@/components/ui/checkbox";
import { api, type RouterOutputs } from "@/trpc/react";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
  type Table,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDebounce } from "use-debounce";

export const TableContext = createContext<TableContextType>(undefined);

export type TableContextType =
  | {
      tableId: string;
      workspaceId: string;

      table?: RouterOutputs["table"]["getById"];
      workspace?: RouterOutputs["workspace"]["getWorkspaceForTableContext"];
      workspaces?: RouterOutputs["workspace"]["getAll"];

      isSidebarOpen: boolean;
      setIsSidebarOpen: (isSidebarOpen: boolean) => void;
      isSidebarHovered: boolean;
      setIsSidebarHovered: (isSidebarHovered: boolean) => void;

      reactTable: Table<
        {
          id: string;
        } & Record<string, string | null>
      >;
    }
  | undefined;

export function TableProvider({
  tableId,
  workspaceId,
  children,
}: {
  tableId: string;
  workspaceId: string;
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const { data: table, isLoading: isLoadingTable } = api.table.getById.useQuery(
    {
      id: tableId,
    },
  );

  const { data: tableColumns = [], isLoading: isLoadingTableColumns } =
    api.table.getTableColumns.useQuery({
      tableId: tableId,
    });

  const { data: tableRows = [], isLoading: isLoadingTableRows } =
    api.table.getTableRows.useQuery({
      tableId: tableId,
    });

  const { data: workspace } =
    api.workspace.getWorkspaceForTableContext.useQuery({
      id: workspaceId,
    });

  const { data: cells = [], isLoading: isLoadingCells } =
    api.table.getTableCells.useQuery({
      tableId: tableId,
    });

  const { data: workspaces = [] } = api.workspace.getAll.useQuery();

  const isLoading =
    isLoadingTable ||
    isLoadingTableColumns ||
    isLoadingTableRows ||
    isLoadingCells;

  // map cells to rows
  const rows = useMemo(() => {
    const rows_mapped = (tableRows ?? []).map((row) => ({
      id: row.id,
      cells: cells.filter((cell) => cell.tableRowId === row.id),
    }));

    // convert cell column id to key value
    const rows_mapped_with_keys = rows_mapped.map(({ cells, ...row }) => {
      const cells_to_keys = (tableColumns ?? []).reduce(
        (acc, column) => {
          acc[column.id] =
            cells.find((cell) => cell.tableColumnId === column.id)?.value ??
            null;
          return acc;
        },
        {} as Record<string, string | null>,
      );
      return { ...row, ...cells_to_keys } as typeof row &
        Record<string, string | null>;
    });

    return rows_mapped_with_keys;
  }, [cells, tableRows, tableColumns]);

  // create column def from tableColumns
  //@ts-expect-error - TODO: fix this
  const columns = useMemo<ColumnDef<(typeof rows)[number]>[]>(() => {
    if (isLoading) return [];
    const columns = tableColumns ?? [];
    return [
      {
        id: "select",
        accessorKey: "select",
        sortingFn: (rowA, rowB) => {
          const valueA = columns[0]?.id ? rowA.original[columns[0]?.id] : null;
          const valueB = columns[0]?.id ? rowB.original[columns[0]?.id] : null;
          if (!valueA && !valueB) return 0;
          if (!valueA) return -1;
          if (!valueB) return 1;
          return valueB.localeCompare(valueA);
        },
        header: ({ table }) => (
          <div className="flex items-center justify-center gap-2">
            <div
              className="flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(checked) =>
                  table.toggleAllPageRowsSelected(
                    checked === "indeterminate" ? undefined : checked,
                  )
                }
                className="h-4 w-4"
                disabled={isLoading}
              />
            </div>
            <span className="text-sm font-semibold">
              {columns[0]?.name ?? ""}
            </span>
          </div>
        ),
        cell: ({
          row,
          relative_index,
        }: {
          row: Row<{ id: string } & Record<string, string | null>>;
          relative_index: number;
        }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [isHovering, setIsHovering] = useState(false);
          const showCheckbox = isHovering || row.getIsSelected();

          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [value, setValue] = useState(
            columns[0]?.id ? (row.original[columns[0]?.id] ?? null) : null,
          );
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const edited = useRef(false);
          const utils = api.useUtils();
          const { mutate: updateCell, isPending } =
            api.table.updateCell.useMutation({
              onMutate: (data) => {
                utils.table.getTableCells.setData(
                  { tableId: tableId },
                  (old) => {
                    if (!old) return old;
                    return old.map((cell) => {
                      if (
                        cell.tableRowId === row.original.id &&
                        cell.tableColumnId === columns[0]?.id
                      ) {
                        return { ...cell, value: data.value };
                      }
                      return cell;
                    });
                  },
                );
              },
            });

          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [debounced] = useDebounce(value, 1000);

          // eslint-disable-next-line react-hooks/rules-of-hooks
          useEffect(() => {
            if (!edited.current) return;
            if (!columns[0]?.id) return;
            updateCell({
              tableId: tableId,
              tableRowId: row.original.id,
              tableColumnId: columns[0]?.id,
              value: debounced,
            });
          }, [debounced, updateCell, row.original.id]);

          return (
            <div
              className="relative flex w-full items-start gap-2"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="mt-1 ml-3 w-[20px]">
                {showCheckbox ? (
                  <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(checked) =>
                      row.toggleSelected(
                        checked === "indeterminate" ? undefined : checked,
                      )
                    }
                    disabled={isLoading}
                  />
                ) : (
                  <div className="text-center font-medium">
                    {relative_index + 1}
                  </div>
                )}
              </div>
              <textarea
                className="mb-[2px] h-full w-full resize-none px-2 py-[2px] text-sm"
                value={value ?? ""}
                onChange={(e) => {
                  setValue(e.target.value);
                  edited.current = true;
                }}
              />
              {isPending && (
                <Loader2 className="absolute right-1 bottom-1 h-4 w-4 animate-spin" />
              )}
            </div>
          );
        },
        enableHiding: false,
        size: 300,
      },

      ...columns.slice(1).map((column) => ({
        id: column.id,
        accessorKey: column.id,
        sortingFn: (
          rowA: Row<(typeof rows)[number]>,
          rowB: Row<(typeof rows)[number]>,
        ) => {
          const valueA = rowA.original[column.id];
          const valueB = rowB.original[column.id];
          if (!valueA && !valueB) return 0;
          if (!valueA) return -1;
          if (!valueB) return 1;
          return valueB.localeCompare(valueA);
        },
        header: () => (
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">{column.name}</span>
          </div>
        ),
        cell: ({
          row,
        }: {
          row: Row<{ id: string } & Record<string, string | null>>;
        }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [value, setValue] = useState(row.original[column.id] ?? null);
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const edited = useRef(false);
          const utils = api.useUtils();
          const { mutate: updateCell, isPending } =
            api.table.updateCell.useMutation({
              onMutate: (data) => {
                utils.table.getTableCells.setData(
                  { tableId: tableId },
                  (old) => {
                    if (!old) return old;
                    return old.map((cell) => {
                      if (
                        cell.tableRowId === row.original.id &&
                        cell.tableColumnId === column.id
                      ) {
                        return { ...cell, value: data.value };
                      }
                      return cell;
                    });
                  },
                );
              },
            });

          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [debounced] = useDebounce(value, 1000);

          // eslint-disable-next-line react-hooks/rules-of-hooks
          useEffect(() => {
            if (!edited.current) return;
            updateCell({
              tableId: tableId,
              tableRowId: row.original.id,
              tableColumnId: column.id,
              value: debounced,
            });
          }, [debounced, updateCell, row.original.id]);

          return (
            <div className="relative flex flex-1 items-center gap-2">
              <textarea
                className="h-full w-full resize-none px-2 py-[2px] text-sm"
                value={value ?? ""}
                onChange={(e) => {
                  setValue(e.target.value);
                  edited.current = true;
                }}
              />
              {isPending && (
                <Loader2 className="absolute right-1 bottom-1 h-4 w-4 animate-spin" />
              )}
            </div>
          );
        },
        size: 200,
      })),
    ];
  }, [tableColumns, tableId, isLoading]);

  const reactTable = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      columnPinning: {
        left: ["select"],
      },
    },
    enableRowSelection: true,
  });

  return (
    <TableContext.Provider
      value={{
        tableId,
        workspaceId,

        table,
        workspace,
        workspaces,
        reactTable,

        isSidebarOpen,
        setIsSidebarOpen,
        isSidebarHovered,
        setIsSidebarHovered,
      }}
    >
      <AnimatePresence>
        <motion.div
          key={"loader"}
          animate={{
            opacity: isLoading ? 1 : 0,
            pointerEvents: isLoading ? "auto" : "none",
          }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-white"
        >
          <Loader2 className="h-8 w-8 animate-spin" />
        </motion.div>

        {children}
      </AnimatePresence>
    </TableContext.Provider>
  );
}

export function useTableContext() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTableContext must be used within a TableProvider");
  }
  return context;
}
