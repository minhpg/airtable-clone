import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, FileText, Grid3X3, Sparkles } from "lucide-react";

const startOptions = [
  {
    title: "Start with Omni",
    description: "Use AI to build a custom app tailored to your workflow",
    icon: Sparkles,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Start with templates",
    description: "Select a template to get started and customize as you go.",
    icon: Grid3X3,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Quickly upload",
    description: "Easily migrate your existing projects in just a few minutes.",
    icon: ArrowUp,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Build an app on your own",
    description: "Start with a blank app and build your ideal workflow.",
    icon: FileText,
    iconColor: "text-gray-600",
    bgColor: "bg-gray-50",
  },
];

export function StartCards() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
      {startOptions.map((option, index) => {
        const IconComponent = option.icon;
        return (
          <Card
            key={index}
            className="cursor-pointer p-0 transition-all hover:translate-y-[-2px] hover:shadow-md"
          >
            <CardContent className="p-5">
              <div
                className={`h-12 w-12 ${option.bgColor} mb-4 flex items-center justify-center rounded-lg`}
              >
                <IconComponent className={`h-6 w-6 ${option.iconColor}`} />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{option.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {option.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
