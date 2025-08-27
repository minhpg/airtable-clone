"use client";

import { SidebarSmall } from "@/components/airtable/sidebar-small";
import { TableProvider } from "./table-context";
import { TableGrid } from "./table-grid";
import { TableHeader } from "./table-header";
import { TableNavbar } from "./table-navbar";
import { TableSidebar } from "./table-sidebar";
import { TableToolbar } from "./table-toolbar";

export function TableLayout({
  tableId,
  workspaceId,
}: {
  tableId: string;
  workspaceId: string;
}) {
  return (
    <TableProvider tableId={tableId} workspaceId={workspaceId}>
      <div className="flex h-screen overflow-y-hidden bg-white">
        <SidebarSmall />
        <div className="w-[calc(100vw-48px)]">
          <TableHeader />
          <div>
            <TableNavbar />
            <TableToolbar />
            <div className="flex h-full">
              <TableSidebar />
              <TableGrid
                className="max-h-[calc(100vh-49px-36px-60px)]"
                rowClassName={(row) => {
                  if (row.getIsSelected()) {
                    return "bg-muted";
                  }
                  return "";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </TableProvider>
  );
}
