"use client";

import LoadingButton from "@/components/loading-button";
import { buttonVariants } from "@/components/ui/button";
import { YearContainer } from "@/components/year-container";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { ClassStreamData } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { useGetAllClassStreamsQueryWithInitialData } from "../../hooks";

interface ListOfClassStreamsProps {
  classStreams: ClassStreamData[];
}

export default function ListOfClassStreams({
  classStreams,
}: ListOfClassStreamsProps) {
  const { data, status, isFetching, refetch, error } =
    useGetAllClassStreamsQueryWithInitialData(classStreams);

  if (status === "error") {
    console.error(error);
  }
  return (
    <div className="sticky top-10 max-h-[75vh] w-full max-w-fit space-y-2 overflow-y-auto scroll-smooth rounded-md border bg-card p-4">
      <h1 className="text-xl">Classes and stream</h1>
      <div>
        {status === "error" ? (
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
            {data.map((item) => (
              <LinkComponent key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface LinkComponentProps {
  item: ClassStreamData;
}
function LinkComponent({ item }: LinkComponentProps) {
  const { getNavigationLinkWithPathnameWithoutUpdate } =
    useCustomSearchParams();
  const [isPending, startTransition] = useTransition();
  const params = useParams();

  const year = item.class?.academicYear?.year;
  const classValue = item.class?.class?.slug;
  const level = item.class?.class?.level?.name;
  const stream = item.stream?.name;
  const url = getNavigationLinkWithPathnameWithoutUpdate(
    `/director/management/report-card-management/stream/${item.id}`,
  );

  return (
    <Link
      key={item.id}
      href={url}
      className={cn(
        buttonVariants({
          variant: item.id === params.classStreamId ? "secondary" : "ghost",
          className: "flex flex-row justify-start",
        }),
        isPending && "animate-pulse rounded-md bg-secondary",
      )}
      onClick={() => startTransition(() => {})}
    >
      <YearContainer year={year} />
      <div className="flex flex-col">
        <span className="line-clamp-1 text-ellipsis text-xs capitalize">
          {classValue} {stream} class
        </span>
        <span className="text-xs text-muted-foreground">{level} level</span>
      </div>
    </Link>
  );
}
