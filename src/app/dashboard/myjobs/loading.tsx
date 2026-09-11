import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function MyJobsLoading() {
  return (
    <div className="col-span-3 space-y-4">
      {/* Title & Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <Skeleton className="h-9 w-full md:w-72 rounded-md" />
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <Skeleton className="h-9 w-28 rounded-md" />
              <Skeleton className="h-9 w-28 rounded-md" />
              <Skeleton className="h-9 w-28 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table Skeleton */}
      <Card className="border-border/60 bg-card/60 overflow-hidden">
        <div className="border-b border-border/40 p-4 bg-muted/20">
          <div className="grid grid-cols-6 gap-4 items-center">
            <Skeleton className="h-4 w-28 col-span-2" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12 ml-auto" />
          </div>
        </div>
        <div className="divide-y divide-border/30">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="p-4 grid grid-cols-6 gap-4 items-center">
              <div className="col-span-2 flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <div className="flex items-center gap-2 ml-auto">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
