import { Brain, ChevronRight, Trophy } from "lucide-react";

// Learning Path Item Component
export function LearningPathItem({
  title,
  completed,
  description,
}: {
  title: string;
  completed: number;
  description: string;
}) {
  return (
    <div className="border border-border rounded-md p-3">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">{title}</h4>
        <span className="text-sm">{completed}% complete</span>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{description}</p>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full"
          style={{ width: `${completed}%` }}
        ></div>
      </div>
    </div>
  );
}

// Learning Path Roadmap Component
export function LearningPathRoadmap() {
  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold flex items-center gap-2">
          <Brain className="h-5 w-5" />
          <span>Learning Roadmap</span>
        </h3>
        <button className="text-primary text-sm flex items-center">
          View all <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center p-2 rounded-md hover:bg-accent/50 transition-colors">
          <div className="bg-primary/10 rounded-md p-2 mr-3">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium">Complete Beginners Path</h4>
            <div className="flex justify-between items-center mt-1">
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full"
                  style={{ width: "70%" }}
                ></div>
              </div>
              <span className="text-xs text-muted-foreground">70%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center p-2 rounded-md hover:bg-accent/50 transition-colors">
          <div className="bg-orange-500/10 rounded-md p-2 mr-3">
            <Brain className="h-5 w-5 text-orange-500" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium">Algorithm Mastery</h4>
            <div className="flex justify-between items-center mt-1">
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-orange-500 h-1.5 rounded-full"
                  style={{ width: "45%" }}
                ></div>
              </div>
              <span className="text-xs text-muted-foreground">45%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
