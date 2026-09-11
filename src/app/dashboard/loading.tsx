import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <>
      <div className="@container grid grid-cols-1 auto-rows-max items-start gap-4 md:gap-4 @3xl/main:col-span-2">
        {/* Career Nudge Banner Skeleton */}
        <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-card/60 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3.5 w-full max-w-lg" />
              </div>
            </div>
            <Skeleton className="h-8 w-28 rounded-lg shrink-0" />
          </div>
        </div>

        {/* Metrics Row Skeleton */}
        <div className="grid gap-4 @lg:grid-cols-4">
          {/* Jobs Applied Action Card */}
          <Card className="@lg:col-span-1 border-border/60 bg-card/60">
            <CardHeader className="pb-2">
              <Skeleton className="h-3.5 w-24" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-9 w-full rounded-md" />
            </CardContent>
          </Card>

          {/* Activity Cards (3 cards) */}
          <Card className="@lg:col-span-3 border-border/60 bg-card/60">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-7 w-20 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2 p-3 rounded-lg bg-muted/20 border border-border/30">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-7 w-12" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Bar Chart Skeleton */}
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64 flex items-end justify-between gap-3 px-2 pt-6">
              {[40, 65, 30, 85, 55, 70, 45, 90, 60, 75, 50, 80].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <Skeleton
                    className="w-full rounded-t-sm"
                    style={{ height: `${h}%` }}
                  />
                  <Skeleton className="h-3 w-6" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Recent Activity Skeleton */}
      <div className="@3xl/main:relative @3xl/main:self-stretch">
        <Card className="border-border/60 bg-card/60 h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/40">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-7 w-24 rounded-md" />
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-muted/10"
              >
                <div className="space-y-1.5 flex-1 mr-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full shrink-0" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Activity Heatmap Skeleton */}
      <div className="w-full col-span-3">
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-7 w-20 rounded-md" />
          </CardHeader>
          <CardContent className="pt-2">
            <Skeleton className="h-32 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
