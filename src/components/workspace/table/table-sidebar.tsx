"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Grid3X3, Kanban, Plus, Settings } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTableContext } from "./table-context";

export function TableSidebar() {
  const { isSidebarOpen, isSidebarHovered } = useTableContext();
  return (
    <AnimatePresence>
      {(isSidebarOpen || isSidebarHovered) && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 256, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-[calc(100vh-49px-36px-60px)] border-r bg-white"
        >
          <div className="flex h-full flex-col">
            <div className="flex-1 p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Views
                  </span>
                </div>

                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="h-8 w-full justify-between px-2 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Grid3X3 className="h-3 w-3" />
                      <span>Grid view</span>
                    </div>
                    <ChevronDown className="h-3 w-3" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-full px-2 text-sm"
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Create new...
                  </Button>
                </div>

                <Separator />

                <div className="space-y-1">
                  <div className="relative">
                    <Input
                      placeholder="Find a view"
                      className="h-7 pr-8 pl-8 text-xs"
                    />
                    <Settings className="absolute top-1/2 left-2 h-3 w-3 -translate-y-1/2 transform text-gray-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="h-8 w-full justify-start bg-blue-50 px-2 text-sm text-blue-700"
                  >
                    <Grid3X3 className="mr-2 h-3 w-3" />
                    Grid view
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-8 w-full justify-start px-2 text-sm"
                  >
                    <Kanban className="mr-2 h-3 w-3" />
                    Kanban
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
