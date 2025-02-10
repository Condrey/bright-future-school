"use client";

import LoadingButton from "@/components/loading-button";
import { usePupilColumns } from "@/components/school-fees/class-term/column";
import { DataTable } from "@/components/ui/data-table";
import DataTableLoadingSkeleton from "@/components/ui/data-table-loading-skeleton";
import { ClassStreamData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getDefaultedStudents } from "./action";

interface ListOfPupilsProps {
  feesAmount: number;
  classStream: ClassStreamData;
  classTermId: string;
}

export default function ListOfPupils({
  classStream,
  classTermId,
  feesAmount,
}: ListOfPupilsProps) {
  const { data, status, isFetching, refetch } = useQuery({
    queryKey: ["pupils", "classStream", classStream.id],
    queryFn: async () =>
      getDefaultedStudents({
        feesAmount,
        classStreamId: classStream.id,
        classTermId,
      }),
  });
  return (
    <>
      <div className="size-full space-y-4">
        {status === "pending" ? (
          <DataTableLoadingSkeleton />
        ) : status === "error" ? (
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
        ) : status === "success" && !data.length ? (
          <div className="flex size-full flex-col items-center justify-center gap-4">
            <p className="text-muted-foreground">
              There are no assigned pupils/ students
            </p>
          </div>
        ) : (
          <DataTable
            columns={usePupilColumns({
              classTermId,
              feesAmount,
            })}
            data={data}
            ROWS_PER_TABLE={5}
            filterColumn={{ id: "user_name", label: "pupil/ student" }}
          />
        )}
      </div>
    </>
  );
}
