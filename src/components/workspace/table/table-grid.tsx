import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { flexRender, type Row, type Table } from "@tanstack/react-table";
import {
  useVirtualizer,
  type VirtualItem,
  type Virtualizer,
} from "@tanstack/react-virtual";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  GripVertical,
  Plus,
  Search,
} from "lucide-react";
import { memo, useCallback, useState } from "react";
import { useTableContext } from "./table-context";

export function TableGrid({
  is_loading = true,
  className,
  onRowClick,
  rowClassName,
  overscan = 10,
  row_height = 45,
  header_height = 36,
}: {
  is_loading?: boolean;
  striped?: boolean;
  scroll_behavior?: "smooth" | "instant" | "auto";
  className?: string;
  onRowClick?: ({
    row,
    table,
    e,
  }: {
    row: Row<{ id: string } & Record<string, string | null>>;
    table: Table<{ id: string } & Record<string, string | null>>;
    e: React.MouseEvent<HTMLDivElement>;
  }) => void;
  rowClassName?:
    | ((
        row: Row<{ id: string } & Record<string, string | null>>,
      ) => string | null | undefined | (string | null | undefined)[])
    | string
    | undefined
    | null
    | (string | null | undefined)[];
  overscan?: number;
  row_height?: number;
  header_height?: number;
}) {
  const { reactTable, tableId } = useTableContext();
  const [table_ref, setTableRef] = useState<HTMLDivElement | null>(null);

  const apiUtils = api.useUtils();
  // Add mutations for adding columns and rows
  const { mutate: addColumn } = api.table.addColumn.useMutation({
    onSuccess: (column) => {
      apiUtils.table.getTableColumns.setData({ tableId }, (old) => {
        if (!old) return [column];
        return [...old, column];
      });
    },
  });

  const { mutate: addRow } = api.table.addRow.useMutation({
    onSuccess: (row) => {
      apiUtils.table.getTableRows.setData({ tableId }, (old) => {
        if (!old) return [row];
        return [...old, row];
      });
    },
  });

  // Use pagination model if pagination is enabled, otherwise use regular model
  const { rows } = reactTable.getRowModel();

  const getItemKey = useCallback(
    (index: number) => {
      // Handle buffer row
      if (index === rows.length) return `buffer-row-${index}`;
      return rows[index]?.id ?? index;
    },
    [rows],
  );

  const virtualizer = useVirtualizer({
    count: rows.length + 1, // Add 1 for buffer row
    getItemKey,
    estimateSize: () => row_height,
    initialOffset: 36,
    overscan,
    getScrollElement: () => table_ref,
    useAnimationFrameWithResizeObserver: true,
  });

  const width = reactTable.getTotalSize() + 250; // Add 150px for buffer column

  return (
    <div
      className={cn("relative z-0 h-full w-full overflow-hidden", className)}
    >
      <div
        className={cn(
          "relative w-full overflow-auto",
          className,
          rows.length === 0 && "overflow-hidden",
        )}
        style={{
          contain: "paint",
          willChange: "transform",
        }}
        ref={setTableRef}
      >
        <div className="sticky top-0 z-11 w-full">
          <div
            className="flex"
            style={{
              width: width,
              height: header_height,
            }}
          >
            {reactTable.getLeafHeaders().map((header) => {
              const isPinned = header.column.getIsPinned();
              const pinnedDirection =
                isPinned === "left"
                  ? "left"
                  : isPinned === "right"
                    ? "right"
                    : null;

              return (
                <div
                  key={header.id}
                  className={cn(
                    "group bg-muted relative flex border px-1 py-1", // add relative for absolute child
                    pinnedDirection === "left" && "sticky z-10",
                    pinnedDirection === "right" && "sticky z-10",
                    header.column.getIsResizing() && "bg-blue-100",
                  )}
                  style={{
                    width: header.column.getIsResizing()
                      ? header.getSize() +
                        (reactTable.getState().columnSizingInfo.deltaOffset ??
                          0)
                      : header.getSize(),
                    minWidth: header.column.getIsResizing()
                      ? header.getSize() +
                        (reactTable.getState().columnSizingInfo.deltaOffset ??
                          0)
                      : header.getSize(),
                    maxWidth: header.column.getIsResizing()
                      ? header.getSize() +
                        (reactTable.getState().columnSizingInfo.deltaOffset ??
                          0)
                      : header.getSize(),
                    height: header_height,
                    minHeight: header_height,
                    maxHeight: header_height,
                    ...(pinnedDirection === "left" && {
                      left: header.getStart(),
                    }),
                    ...(pinnedDirection === "right" && {
                      right: header.getStart(),
                    }),
                  }}
                >
                  <div
                    className={cn(
                      "line-clamp-1 flex w-fit items-center justify-start gap-1.5 rounded-md px-2 py-1 text-sm font-normal text-nowrap text-black transition-all select-none",
                      header.column.getIsResizing() && "bg-blue-100",
                      header.column.getCanSort() &&
                        "cursor-pointer hover:bg-neutral-200",
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      display: "flex",
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    {header.column.getCanSort() && (
                      <>
                        {!header.column.getIsSorted() && (
                          <ArrowUpDown className="h-3 w-3" />
                        )}
                        {header.column.getIsSorted() === "desc" && (
                          <ArrowUp className="h-3 w-3" />
                        )}
                        {header.column.getIsSorted() === "asc" && (
                          <ArrowDown className="h-3 w-3" />
                        )}
                      </>
                    )}
                  </div>
                  {/* Resize handle */}
                  {header.column.getCanResize() && (
                    <div
                      onDoubleClick={() => header.column.resetSize()}
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        height: "100%",
                        cursor: "col-resize",
                        zIndex: 9,
                        userSelect: "none",
                      }}
                      className={cn(
                        "resize-handle bg-muted/50 flex items-center justify-center px-2 backdrop-blur transition-all",
                        header.column.getIsResizing() && "bg-blue-100/50",
                      )}
                    >
                      <GripVertical className="h-2 w-2 text-neutral-400 transition-all hover:text-black active:text-blue-600" />
                    </div>
                  )}
                </div>
              );
            })}
            {/* Buffer column header */}
            <div
              className="group bg-muted relative flex cursor-pointer border px-1 py-1 transition-all hover:bg-neutral-200"
              style={{
                width: 150,
                minWidth: 150,
                maxWidth: 150,
                height: header_height,
                minHeight: header_height,
                maxHeight: header_height,
              }}
              onClick={() => {
                addColumn({
                  tableId,
                  name: `Column ${reactTable.getLeafHeaders().length}`,
                });
              }}
            >
              <div className="flex w-full items-center justify-center gap-1.5 rounded-md px-2 py-1 text-xs font-light text-neutral-500 transition-all select-none">
                <Plus className="h-4 w-4" />
                <span>Add Column</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div
            style={{
              width,
              position: "relative",
              height: virtualizer.getTotalSize() + 100,
            }}
          >
            {virtualizer.getVirtualItems().map((virtual_row) => {
              // Handle buffer row
              if (virtual_row.index === rows.length) {
                return (
                  <div
                    key={virtual_row.key}
                    data-index={virtual_row.index}
                    className="flex w-full cursor-pointer bg-white"
                    ref={virtualizer.measureElement}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtual_row.size}px`,
                      transform: `translateY(${virtual_row.start - virtualizer.options.scrollMargin}px)`,
                    }}
                  >
                    {/* Buffer row cells */}
                    {reactTable.getLeafHeaders().map((header) => {
                      const isPinned = header.column.getIsPinned();
                      const pinnedDirection =
                        isPinned === "left"
                          ? "left"
                          : isPinned === "right"
                            ? "right"
                            : null;

                      if (header.index) {
                        return null;
                      }

                      return (
                        <div
                          key={header.id}
                          className={cn(
                            "flex items-center border bg-white px-3 py-1 text-sm font-light text-neutral-400 transition-all",
                            header.index === 0 &&
                              "hover:bg-muted cursor-pointer",
                          )}
                          style={{
                            width: header.column.getIsResizing()
                              ? header.getSize() +
                                (reactTable.getState().columnSizingInfo
                                  .deltaOffset ?? 0)
                              : header.getSize(),
                            minWidth: header.column.getIsResizing()
                              ? header.getSize() +
                                (reactTable.getState().columnSizingInfo
                                  .deltaOffset ?? 0)
                              : header.getSize(),
                            maxWidth: header.column.getIsResizing()
                              ? header.getSize() +
                                (reactTable.getState().columnSizingInfo
                                  .deltaOffset ?? 0)
                              : header.getSize(),
                            height: header_height,
                            minHeight: header_height,
                            maxHeight: header_height,
                            ...(pinnedDirection === "left" && {
                              left: header.getStart(),
                            }),
                            ...(pinnedDirection === "right" && {
                              right: header.getStart(),
                            }),
                          }}
                        >
                          <div
                            className="flex w-full items-center justify-center gap-2"
                            onClick={() => {
                              addRow({ tableId });
                            }}
                          >
                            <Plus className="h-4 w-4" />
                            <span className="text-xs">Add Row</span>
                          </div>
                        </div>
                      );
                    })}

                    <div
                      style={{
                        width: 150,
                        minWidth: 150,
                        maxWidth: 150,
                        height: 20,
                      }}
                    ></div>
                  </div>
                );
              }

              return (
                <TableGridRow
                  rows={rows}
                  key={virtual_row.key}
                  virtual_row={virtual_row}
                  virtualizer={virtualizer}
                  onRowClick={onRowClick}
                  rowClassName={rowClassName}
                  row_height={row_height}
                />
              );
            })}
          </div>
        </div>

        {rows.length === 0 && !is_loading && (
          <div className="flex min-h-64 flex-1 flex-col items-center justify-center">
            <Search
              className="mx-auto mb-3 h-10 w-10 rounded-lg text-center text-neutral-800"
              size="2x"
            />
            <div className="mx-auto text-center text-xl font-medium">
              No data found
            </div>
          </div>
        )}
        {/* {is_loading && (
            <div className="flex flex-col items-center justify-center divide-y divide-neutral-200">
              {Array.from({ length: 100 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-muted h-[45px] w-full animate-pulse"
                />
              ))}
            </div>
          )} */}
      </div>
    </div>
  );
}

function TableGridRowImpl({
  rows,
  virtual_row,
  virtualizer,
  onRowClick,
  rowClassName,
  row_height = 45,
}: {
  rows: Row<{ id: string } & Record<string, string | null>>[];
  virtual_row: VirtualItem;
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  onRowClick?: ({
    row,
    table,
    e,
  }: {
    row: Row<{ id: string } & Record<string, string | null>>;
    table: Table<{ id: string } & Record<string, string | null>>;
    e: React.MouseEvent<HTMLDivElement>;
  }) => void;
  rowClassName?:
    | ((
        row: Row<{ id: string } & Record<string, string | null>>,
      ) => string | null | undefined | (string | null | undefined)[])
    | string
    | undefined
    | null
    | (string | null | undefined)[];
  row_height?: number;
}) {
  const { reactTable } = useTableContext();

  const row = rows[virtual_row.index]!;

  const selected = row?.getIsSelected();

  const visible_cells = row?.getVisibleCells();

  return (
    <div
      key={virtual_row.key}
      data-index={virtual_row.index}
      className={cn(`group flex w-full cursor-pointer bg-white`)}
      ref={virtualizer.measureElement}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: `${virtual_row.size}px`,
        transform: `translateY(${virtual_row.start - virtualizer.options.scrollMargin}px)`,
      }}
      onClick={(e) => {
        onRowClick?.({ row, table: reactTable, e });
      }}
    >
      {visible_cells?.map((cell) => {
        const isPinned = cell.column.getIsPinned();
        const pinnedDirection =
          isPinned === "left" ? "left" : isPinned === "right" ? "right" : null;

        return (
          <div
            key={cell.id}
            className={cn(
              "group-hover:bg-muted flex items-center border bg-white text-sm font-light text-neutral-600 transition-all",
              typeof rowClassName === "function"
                ? rowClassName?.(row)
                : rowClassName,
              pinnedDirection === "left" && "sticky left-0 z-10",
              pinnedDirection === "right" && "sticky right-0 z-10",
            )}
            style={{
              width: cell.column.getIsResizing()
                ? cell.column.getSize() +
                  (reactTable.getState().columnSizingInfo.deltaOffset ?? 0)
                : cell.column.getSize(),
              minWidth: cell.column.getIsResizing()
                ? cell.column.getSize() +
                  (reactTable.getState().columnSizingInfo.deltaOffset ?? 0)
                : cell.column.getSize(),
              maxWidth: cell.column.getIsResizing()
                ? cell.column.getSize() +
                  (reactTable.getState().columnSizingInfo.deltaOffset ?? 0)
                : cell.column.getSize(),
              height: row_height,
              ...(pinnedDirection === "left" && {
                left: cell.column.getStart(pinnedDirection),
              }),
              ...(pinnedDirection === "right" && {
                right: cell.column.getStart(pinnedDirection),
              }),
            }}
          >
            {flexRender(cell.column.columnDef.cell, {
              ...cell.getContext(),
              selected,
              relative_index: virtual_row.index,
            })}
          </div>
        );
      })}
      {/* Buffer column cell for each row */}
      <div
        style={{
          width: 80,
          minWidth: 80,
          maxWidth: 80,
          height: 20,
        }}
      ></div>
    </div>
  );
}

export const TableGridRow = memo(TableGridRowImpl) as typeof TableGridRowImpl;
