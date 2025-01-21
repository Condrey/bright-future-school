"use client";

import { directorDashboardParamsQueryKey } from "@/app/(director)/hook";
import LoadingButton from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { PARAM_NAME_ACADEMIC_YEAR, PARAM_NAME_TERM } from "@/lib/constants";
import { DirectorDashboardParam, TermWithYearData } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { yearTermStreamsQueryKey } from "../../repository/(users)/utils";
import { getYearTermFeesManagementSummary } from "./action";
import { useYearTermStreamColumns } from "./columns";

interface ListOfTermClassStreamsProps {
  terms: TermWithYearData[];
}
export default function ListOfTermClassStreams({
  terms,
}: ListOfTermClassStreamsProps) {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const year = searchParams.get(PARAM_NAME_ACADEMIC_YEAR)!;
  const termId = searchParams.get(PARAM_NAME_TERM)!;

  const { data, status, error, isFetching, refetch } = useQuery({
    queryKey: yearTermStreamsQueryKey(year, termId),
    queryFn: async () =>
      await getYearTermFeesManagementSummary({ year, termId }),
    initialData: terms,
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
        columns={useYearTermStreamColumns}
        data={data}
        ROWS_PER_TABLE={5}
        filterColumn={{ id: "classStream_class_class_name", label: "Class" }}
      />
    </div>
  );
}

export function ListOfTermClassStreamsFallback() {
  // TODO: implement the function body.
  return <div>Loading</div>;
}
