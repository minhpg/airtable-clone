import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, HelpCircle, Menu, Search } from "lucide-react";

export function Header() {
  return (
    <div className="sticky top-0 z-10 border-b bg-white">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600">
              <span className="text-xs font-bold text-white">M</span>
            </div>
            <span className="text-lg font-semibold">Minh&apos;s Airtable</span>
          </div>
        </div>

        <div className="mx-8 max-w-md flex-1">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search..."
              className="border-gray-200 bg-gray-50 pl-10"
            />
            <Badge
              variant="secondary"
              className="absolute top-1/2 right-2 -translate-y-1/2 transform text-xs"
            >
              ⌘K
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-gray-600">
            <HelpCircle className="mr-1 h-4 w-4" />
            Help
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Bell className="h-4 w-4" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-600 text-sm font-medium text-white">
              M
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
