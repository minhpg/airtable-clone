import { TableLayout } from "@/components/workspace/table/table-layout";

export type WorkspaceTablePageProps = {
  params: Promise<{
    workspace_id: string;
    table_id: string;
  }>;
};

export default async function WorkspaceTablePage({
  params,
}: WorkspaceTablePageProps) {
  const { table_id, workspace_id } = await params;

  return <TableLayout tableId={table_id} workspaceId={workspace_id} />;
}
