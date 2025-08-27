"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import {
  ArrowUpDown,
  Eye,
  Filter,
  Group,
  Loader2,
  Menu,
  Palette,
  Share2,
  Sprout,
} from "lucide-react";
import { useTableContext } from "./table-context";

export function TableToolbar() {
  const { isSidebarOpen, setIsSidebarOpen, tableId } = useTableContext();
  const utils = api.useUtils();
  const { mutate: seedTable, isPending: isSeedingTable } =
    api.table.seedTable.useMutation({
      onSuccess: () => {
        void Promise.all([
          utils.table.getTableRows.invalidate({ tableId: tableId }),
          utils.table.getTableColumns.invalidate({ tableId: tableId }),
          utils.table.getTableCells.invalidate({ tableId: tableId }),
        ]);
      },
    });
  return (
    <div className="border-b bg-white p-2">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          data-active={isSidebarOpen}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          //   onMouseEnter={() => setIsSidebarHovered(true)}
          //   onMouseLeave={() => setIsSidebarHovered(false)}
        >
          <Menu className="h-4 w-4" />
        </Button>
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => seedTable({ tableId: tableId })}
            disabled={isSeedingTable}
          >
            {isSeedingTable ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sprout className="h-4 w-4" />
            )}
            Seed table
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            <Eye className="h-4 w-4" />
            Hide fields
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            <Group className="h-4 w-4" />
            Group
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            <ArrowUpDown className="h-4 w-4" />
            Sort
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            <Palette className="h-4 w-4" />
            Color
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            <Share2 className="h-4 w-4" />
            Share and sync
          </Button>
        </div>
      </div>
    </div>
  );
}
