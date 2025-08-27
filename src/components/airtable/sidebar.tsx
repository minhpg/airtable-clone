import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Home,
  Plus,
  Share2,
  ShoppingBag,
  Star,
  Upload,
  Users,
} from "lucide-react";

export function Sidebar() {
  return (
    <div className="sticky top-[60px] flex h-[calc(100vh-60px)] w-64 flex-col border-r bg-white">
      <div className="flex-1 space-y-2 p-4">
        {/* Home */}
        <Button
          variant="ghost"
          className="h-10 w-full justify-start gap-3 bg-blue-50 text-blue-700 hover:bg-blue-100"
        >
          <Home className="h-4 w-4" />
          <span className="font-medium">Home</span>
        </Button>

        {/* Starred */}
        <div className="space-y-1">
          <Button variant="ghost" className="h-10 w-full justify-between">
            <div className="flex items-center gap-3">
              <Star className="h-4 w-4" />
              <span>Starred</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
          <div className="ml-7 flex items-center gap-2 text-sm text-gray-500">
            <Star className="h-3 w-3" />
            <span>
              Your starred bases, interfaces, and workspaces will appear here
            </span>
          </div>
        </div>

        {/* Shared */}
        <Button variant="ghost" className="h-10 w-full justify-start gap-3">
          <div className="flex items-center gap-3">
            <Share2 className="h-4 w-4" />
            <span>Shared</span>
          </div>
        </Button>

        {/* Workspaces */}
        <Button variant="ghost" className="h-10 w-full justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4" />
            <span>Workspaces</span>
          </div>
          <div className="flex items-center gap-1">
            <Plus className="h-3 w-3" />
            <ChevronRight className="h-3 w-3" />
          </div>
        </Button>
      </div>

      <Separator />

      <div className="space-y-2 p-4">
        <Button variant="ghost" className="h-10 w-full justify-start gap-3">
          <FolderOpen className="h-4 w-4" />
          <span>Templates and apps</span>
        </Button>

        <Button variant="ghost" className="h-10 w-full justify-start gap-3">
          <ShoppingBag className="h-4 w-4" />
          <span>Marketplace</span>
        </Button>

        <Button variant="ghost" className="h-10 w-full justify-start gap-3">
          <Upload className="h-4 w-4" />
          <span>Import</span>
        </Button>
      </div>

      <div className="p-4">
        <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Create
        </Button>
      </div>
    </div>
  );
}
