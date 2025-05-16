"use client";

import LoadingButton from "@/components/loading-button";
import { DataTable } from "@/components/ui/data-table";
import { ClassStreamData } from "@/lib/types";
import { useClassStreamColumns } from "./(tables)/columns";
import { useGetAllClassStreamsQueryWithInitialData } from "./hooks";

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
    <div>
      {status === "error" ? (
        <div className="flex min-h-[20rem] flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground max-w-sm text-center">
            Error occurred while fetching classes and streams.
          </p>
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
          <p className="text-muted-foreground max-w-sm text-center">
            There are no classes in the database yet, please contact the
            director.
          </p>
        </div>
      ) : (
        <DataTable
          data={data}
          columns={useClassStreamColumns}
          filterColumn={{ id: "class_class_name", label: "class" }}
          ROWS_PER_TABLE={10}
        />
      )}
    </div>
  );
}
