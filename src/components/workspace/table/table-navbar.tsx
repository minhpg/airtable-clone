"use client";

import { Button } from "@/components/ui/button";
import {
  InlineTabs,
  InlineTabsList,
  InlineTabsTrigger,
} from "@/components/ui/inline-tabs";
import { Plus } from "lucide-react";
import { useTableContext } from "./table-context";

export function TableNavbar() {
  const { workspace, tableId } = useTableContext();
  console.log(workspace);
  return (
    <>
      <div className="bg-muted flex items-center justify-start gap-2">
        <InlineTabs defaultValue="grid" value={tableId}>
          <InlineTabsList>
            {(workspace?.tables ?? []).map((table) => (
              <InlineTabsTrigger key={table.id} value={table.id}>
                {table.name}
              </InlineTabsTrigger>
            ))}
          </InlineTabsList>
        </InlineTabs>
        <Button variant="ghost" size="sm" className="text-xs">
          <Plus className="h-4 w-4" />
          Add a table
        </Button>
      </div>
    </>
  );
}
