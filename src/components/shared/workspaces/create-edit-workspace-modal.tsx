"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";

const workspaceSchema = z.object({
  name: z
    .string()
    .min(1, "Workspace name is required")
    .max(100, "Workspace name must be less than 100 characters"),
});

type WorkspaceFormData = z.infer<typeof workspaceSchema>;

export function CreateEditWorkspaceModal({
  open,
  onOpenChange,
  workspaceId,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId?: string | null;
  onSuccess?: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<WorkspaceFormData>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const isEditMode = !!workspaceId;

  // Fetch workspace data when in edit mode
  const { data: workspace, isLoading: isLoadingWorkspace } =
    api.workspace.getById.useQuery(
      { id: workspaceId! },
      {
        enabled: !!workspaceId && open,
      },
    );

  // Reset form when workspace data is loaded
  useEffect(() => {
    if (workspace && isEditMode) {
      form.reset({ name: workspace.name });
    }
  }, [workspace, isEditMode, form]);

  const createWorkspace = api.workspace.create.useMutation({
    onSuccess: () => {
      toast.success("Workspace created successfully");
      onSuccess?.();
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create workspace");
    },
  });

  const updateWorkspace = api.workspace.update.useMutation({
    onSuccess: () => {
      toast.success("Workspace updated successfully");
      onSuccess?.();
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update workspace");
    },
  });

  // Reset form when modal opens/closes or workspaceId changes
  useEffect(() => {
    if (!open) {
      form.reset({ name: "" });
    }
  }, [open, form]);

  const onSubmit = async (data: WorkspaceFormData) => {
    setIsSubmitting(true);
    try {
      if (workspaceId && workspace) {
        await updateWorkspace.mutateAsync({
          id: workspaceId,
          name: data.name,
        });
      } else {
        await createWorkspace.mutateAsync({
          name: data.name,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isSubmitting) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  const title = isEditMode ? "Edit Workspace" : "Create Workspace";
  const description = isEditMode
    ? "Update your workspace details below."
    : "Create a new workspace to organize your tables and data.";

  // Show loading state while fetching workspace data
  if (isEditMode && isLoadingWorkspace) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground text-sm">
              Loading workspace...
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter workspace name..."
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : isEditMode
                    ? "Update Workspace"
                    : "Create Workspace"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
