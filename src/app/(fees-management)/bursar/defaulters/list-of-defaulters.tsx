"use client";

import { yearTermStreamsQueryKey } from "@/app/(director)/director/repository/(users)/utils";
import LoadingButton from "@/components/loading-button";
import { useYearTermStreamColumns } from "@/components/school-fees/columns";
import { DataTable } from "@/components/ui/data-table";
import { PARAM_NAME_ACADEMIC_YEAR, PARAM_NAME_TERM } from "@/lib/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { fetchDefaulterList } from "./action";

export default function ListOfDefaUlters() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const year = searchParams.get(PARAM_NAME_ACADEMIC_YEAR) ?? undefined;
  const termId = searchParams.get(PARAM_NAME_TERM) ?? undefined;

  const { data, status, error, isFetching, refetch } = useQuery({
    queryKey: yearTermStreamsQueryKey(year, termId),
    queryFn: async () => await fetchDefaulterList(),
  });
  if (status === "pending") {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-4">
        <Loader2Icon className="size-4 animate-spin" />
        <p className="max-w-sm text-center text-muted-foreground">
          Fetching list, please wait
        </p>
      </div>
    );
  }
  if (status === "error") {
    console.error(error);
    return (
      <div className="flex size-full flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">
          Error occurred while fetching class streams.
        </p>
        <LoadingButton
          loading={isFetching}
          onClick={() => refetch()}
          className="w-fit"
        >
          Refresh
        </LoadingButton>
      </div>
    );
  }
  if (status === "success" && !data.length) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center gap-4">
        <p className="max-w-sm text-center text-muted-foreground">
          There are no registered defaulters in the system yet
        </p>
      </div>
    );
  }
  return (
    <div>
      <DataTable
        columns={useYearTermStreamColumns(true)}
        data={data}
        ROWS_PER_TABLE={5}
        filterColumn={{ id: "classStream_class_class_name", label: "Class" }}
      />
    </div>
  );
}

export function ListOfDefaUltersFallback() {
  // TODO: implement the function body.
  return <div>Loading</div>;
}
