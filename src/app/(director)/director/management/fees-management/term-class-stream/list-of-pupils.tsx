"use client";

import LoadingButton from "@/components/loading-button";
import { DataTable } from "@/components/ui/data-table";
import { PupilData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getStreamPupils } from "../action";
import { usePupilColumns } from "./column";

interface ListOfPupilsProps {
  pupils: PupilData[];
  classStreamId: string;
}

export default function ListOfPupils({
  pupils,
  classStreamId,
}: ListOfPupilsProps) {
  const { data, status, isFetching, refetch } = useQuery({
    queryKey: ["pupils", "classStream", classStreamId],
    queryFn: async () => getStreamPupils({ classStreamId }),
    initialData: pupils,
  });
  return (
    <div className="size-full space-y-4">
      <span>List of pupils/ students</span>

      {status === "error" ? (
        <div className="flex size-full flex-col items-center justify-center">
          <LoadingButton
            loading={isFetching}
            onClick={() => refetch()}
            variant={"destructive"}
            className="w-fit"
          >
            Refresh
          </LoadingButton>
          <span className="text-muted-foreground">
            An error occurred while fetching this term
          </span>
        </div>
      ) : (
        <DataTable
          columns={usePupilColumns}
          data={data}
          ROWS_PER_TABLE={5}
          filterColumn={{ id: "user_name", label: "pupil/ student" }}
        />
      )}
    </div>
  );
}
