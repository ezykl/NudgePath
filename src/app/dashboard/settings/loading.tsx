import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SettingsLoading() {
  return (
    <div className="flex flex-col col-span-3">
      <Skeleton className="h-7 w-32 mb-4" />
      <div className="flex gap-6">
        {/* Nav Sidebar Skeleton */}
        <div className="flex flex-col gap-1 w-48 shrink-0">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded-none" />
          ))}
        </div>

        {/* Content Area Skeleton */}
        <div className="flex-1 min-w-0">
          <Card className="border-border/60 bg-card/60">
            <CardHeader className="space-y-2 pb-6 border-b border-border/40">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="pt-4 flex justify-end">
                <Skeleton className="h-10 w-28 rounded-md" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
