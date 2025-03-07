"use client";

import LoadingButton from "@/components/loading-button";
import { buttonVariants } from "@/components/ui/button";
import { YearContainer } from "@/components/year-container";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { getAllClassStreams } from "../../action";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { ClassStreamData } from "@/lib/types";
import { useTransition } from "react";

export default function ListOfClassStreams() {
  const { data, status, isFetching, refetch, error } = useQuery({
    queryKey: ["list-of-class-streams"],
    queryFn: getAllClassStreams,
    staleTime: Infinity,
  });

  if (status === "error") {
    console.error(error);
  }
  return (
    <div className="w-full sticky top-10 max-h-[75vh] overflow-y-auto scroll-smooth max-w-fit space-y-2 border rounded-md p-4 bg-card">
      <h1 className="text-xl">Classes and stream</h1>
      <div>
        {status === "pending" ? (
          <div className="flex min-h-[20rem] flex-col items-center justify-center gap-4">
            <span className="max-w-sm text-center text-muted-foreground">
              Loading classes and streams...
            </span>
            <Loader2Icon className="animate-spin" />
          </div>
        ) : status === "error" ? (
          <div className="flex min-h-[20rem] flex-col items-center justify-center gap-4">
            <span className="max-w-sm text-center text-muted-foreground">
              Error occurred while fetching classes and streams.
            </span>
            <LoadingButton
              loading={isFetching}
              className="max-w-fit"
              onClick={() => refetch()}
            >
              Refetch
            </LoadingButton>
          </div>
        ) : status === "success" && !data.length ? (
          <div className="flex min-h-[20rem] flex-col items-center justify-center gap-4">
            <span className="max-w-sm text-center text-muted-foreground">
              There are no classes and streams added in the database yet
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {data.map((item) => <LinkComponent key={item.id} item={item}
            />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface LinkComponentProps{
    item: ClassStreamData
}
function LinkComponent({item}:LinkComponentProps){
    const {getNavigationLinkWithPathnameWithoutUpdate} = useCustomSearchParams()
const [isPending,startTransition] = useTransition()
const params = useParams()

    const year = item.class?.academicYear?.year;
    const classValue = item.class?.class?.slug;
    const level = item.class?.class?.level?.name;
    const stream = item.stream?.name;
    const url = getNavigationLinkWithPathnameWithoutUpdate(`/director/management/report-card-management/stream/${item.id}`)

return  <Link
key={item.id}
href={url}
className={cn(buttonVariants({ variant: item.id===params.classStreamId?"secondary":'ghost',className:'flex flex-row justify-start' }),
isPending&&'bg-secondary animate-pulse rounded-md')}
onClick={()=>startTransition(()=>{})}
>
<YearContainer year={year} />
<div className="flex flex-col"><span className="capitalize text-xs line-clamp-1 text-ellipsis">{classValue} {stream} class</span>
<span className=" text-muted-foreground text-xs">{level} level</span></div>
</Link>

}