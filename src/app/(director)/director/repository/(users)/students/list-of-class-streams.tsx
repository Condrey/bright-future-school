"use client";

import { directorDashboardParamsQueryKey } from "@/app/(director)/hook";
import LoadingButton from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { PARAM_NAME_ACADEMIC_YEAR } from "@/lib/constants";
import { ClassStreamData, DirectorDashboardParam } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { yearClassStreamsQueryKey } from "../utils";
import { useClassStreamsColumns } from "./(tables)/columns";
import { fetchYearClassStreams } from "./action";

interface ListOfClassStreamsProps {
  classStreams: ClassStreamData[];
}
export default function ListOfClassStreams({
  classStreams,
}: ListOfClassStreamsProps) {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const year = searchParams.get(PARAM_NAME_ACADEMIC_YEAR) || "";

  const { data, status, error, isFetching, refetch } = useQuery({
    queryKey: yearClassStreamsQueryKey(year),
    queryFn: async () => await fetchYearClassStreams(year),
    initialData: classStreams,
    // staleTime: Infinity,
  });
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
    async function handleClick() {
      await queryClient.cancelQueries();
      queryClient.setQueryData<DirectorDashboardParam>(
        directorDashboardParamsQueryKey,
        (oldData) => oldData && { ...oldData, classStreams: 0 },
      );
    }
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p>There are no class streams in the database.</p>
        <Button onClick={() => handleClick()}>Create class streams</Button>
      </div>
    );
  }
  return (
    <div>
      <DataTable
        columns={useClassStreamsColumns}
        data={data}
        ROWS_PER_TABLE={10}
        filterColumn={{ id: "class_class_name", label: "Class" }}
      />
    </div>
  );
}

export function ListOfClassStreamsFallback() {
  // TODO: implement the function body.
  return <div>Loading</div>;
}
