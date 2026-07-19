export default function Skeleton({ className = "" }) {
  return <div className={`relative overflow-hidden bg-muted/60 ${className}`}>
    <span className="shimmer absolute inset-0" />
  </div>;
}

export function PropertyCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-card h-full flex flex-col">
      <Skeleton className="aspect-[4/5]" />
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-2 pt-2 mt-auto">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}