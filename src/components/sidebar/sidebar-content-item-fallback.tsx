import { Skeleton } from "@/components/ui/skeleton";

export default function SideBarContentItemFallback() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-3/4" />
      <div className="space-y-2">
        <div className="flex gap-2">
          <Skeleton className="size-8" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="w-full space-y-2 pl-2">
          {Array.from({ length: 7 }, (_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
