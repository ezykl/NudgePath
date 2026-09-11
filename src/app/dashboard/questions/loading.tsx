import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function QuestionsLoading() {
  return (
    <div className="col-span-3 space-y-4">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-72" />
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Cards Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-xl border border-border/60 bg-card/60 space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-6 w-16 rounded-full shrink-0" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="pt-2 flex items-center justify-between border-t border-border/30">
              <Skeleton className="h-3 w-28" />
              <div className="flex gap-2">
                <Skeleton className="h-7 w-7 rounded-md" />
                <Skeleton className="h-7 w-7 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
