import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function WelcomeBanner() {
  return (
    <div className="flex items-center justify-between bg-green-600 px-6 py-4 text-white">
      <div className="flex items-center gap-3">
        <span className="font-medium">
          Welcome to the improved Home. Find, navigate to, and manage your apps
          more easily.
        </span>
        <Button variant="link" className="h-auto p-0 text-white underline">
          See what&apos;s new
        </Button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 text-white hover:bg-green-700"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
