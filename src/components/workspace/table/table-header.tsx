"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Grid3X3 } from "lucide-react";
import { useTableContext } from "./table-context";

export function TableHeader() {
  const { workspace, workspaces } = useTableContext();
  const filteredWorkspaces = workspaces?.filter((w) => w.id !== workspace?.id);
  return (
    <div className="z-10 w-full border-b bg-white">
      <div className="flex items-center justify-between overflow-hidden px-4 py-3">
        {/* Left side - Base name and navigation */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary flex h-8 min-h-8 w-8 min-w-8 items-center justify-center rounded-md">
              <Grid3X3 className="h-4 w-4 text-white" />
            </div>
            <div className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full !pr-1">
                    <span className="line-clamp-1 text-lg font-semibold">
                      {workspace?.name ?? "Untitled Base"}
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem>
                  {filteredWorkspaces && filteredWorkspaces.length > 0 && (
                    <>
                      <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {filteredWorkspaces.map((workspace) => (
                        <DropdownMenuItem key={workspace.id}>
                          {workspace.name}
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Center - Navigation tabs */}
        {/* <div className="hidden items-center gap-4 lg:flex">
          <Button variant="ghost" className="">
            Data
          </Button>
          <Button variant="ghost" className="">
            Automations
          </Button>
          <Button variant="ghost" className="">
            Interfaces
          </Button>
          <Button variant="ghost" className="">
            Forms
          </Button>
        </div> */}

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            See what&apos;s new
          </Button>
          <Button size="sm">Share</Button>
        </div>
      </div>
    </div>
  );
}
