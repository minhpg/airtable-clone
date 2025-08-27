import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export type WorkspacePageProps = {
  params: Promise<{
    workspace_id: string;
  }>;
};

export default async function WorkspacesPage({ params }: WorkspacePageProps) {
  const { workspace_id } = await params;

  const workspace = await api.workspace.getById({
    id: workspace_id,
  });

  if (!workspace) {
    return <div>Workspace not found</div>;
  }

  const table = await api.workspace.seedWorkspace({
    id: workspace_id,
  });

  return redirect(`/workspace/${workspace_id}/${table.id}`);
}
