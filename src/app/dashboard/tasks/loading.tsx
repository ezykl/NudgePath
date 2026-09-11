import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function TasksLoading() {
  return (
    <div className="col-span-3 space-y-4">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>

      {/* Filter / Search Bar */}
      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Skeleton className="h-9 w-full sm:w-64 rounded-md" />
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task List Skeleton */}
      <div className="space-y-2.5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-card/60"
          >
            <div className="flex items-center gap-3 flex-1 mr-4">
              <Skeleton className="h-5 w-5 rounded-md shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
