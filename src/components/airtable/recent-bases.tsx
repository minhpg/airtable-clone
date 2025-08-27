"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api, type RouterOutputs } from "@/trpc/react";
import { ChevronDown, Grid3X3, List, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CreateEditWorkspaceModal } from "../shared/workspaces/create-edit-workspace-modal";

export function RecentBases() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [view, setView] = useState<"list" | "grid">("list");

  const { data: workspaces = [], refetch } = api.workspace.getAll.useQuery();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="flex h-auto items-center gap-2 p-0 text-lg font-medium"
        >
          Recent Workspaces
          <ChevronDown className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Workspace
          </Button>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setView("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {view === "list" ? (
        <RecentBasesListView workspaces={workspaces} />
      ) : (
        <RecentBasesGridView workspaces={workspaces} />
      )}
      {/* Create Modal */}
      <CreateEditWorkspaceModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={() => {
          void refetch();
        }}
      />
    </div>
  );
}

export function RecentBasesGridView({
  workspaces,
}: {
  workspaces: RouterOutputs["workspace"]["getAll"];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {workspaces?.map((workspace) => (
        <Card key={workspace.id}>
          <CardContent>
            <h3 className="font-medium">{workspace.name}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function RecentBasesListView({
  workspaces,
}: {
  workspaces: RouterOutputs["workspace"]["getAll"];
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    null,
  );

  const utils = api.useUtils();

  const handleEditWorkspace = (workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId);
    setIsEditModalOpen(true);
  };

  const handleSuccess = () => {
    void utils.workspace.getAll.invalidate();
  };

  return (
    <div className="space-y-3">
      {workspaces?.map((workspace) => (
        <Link href={`/workspace/${workspace.id}`} key={workspace.id}>
          <Card
            key={workspace.id}
            className="group cursor-pointer p-0 transition-all hover:translate-y-[-2px] hover:shadow-md"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-500">
                  <span className="text-sm font-semibold text-white">
                    {workspace.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{workspace.name}</h3>
                  <p className="text-sm text-gray-500">
                    Created {workspace.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEditWorkspace(workspace.id);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}

      {workspaces?.length === 0 && (
        <Card className="p-0">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-medium">No workspaces yet</h3>
            <p className="mb-4 text-sm text-gray-500">
              Create your first workspace to get started organizing your data.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit Modal */}
      <CreateEditWorkspaceModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        workspaceId={selectedWorkspaceId}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
