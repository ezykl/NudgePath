import { Skeleton } from "./ui/skeleton";

interface LoadingProps {
  rows?: number;
  className?: string;
}

const Loading = ({ rows = 5, className = "" }: LoadingProps) => {
  return (
    <div
      className={`w-full space-y-3 py-2 ${className}`}
      data-testid="loader"
    >
      <div className="flex items-center justify-between px-1">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-2 rounded-xl border border-border/50 p-4 bg-card/40 backdrop-blur-xs">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 py-2.5 border-b border-border/20 last:border-b-0"
          >
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-2/4" />
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
};

export default Loading;
