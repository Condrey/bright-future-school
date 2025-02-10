"use client";

import { yearTermStreamsQueryKey } from "@/app/(director)/director/repository/(users)/utils";
import TermSwitcher from "@/app/(director)/term-switcher";
import YearSwitcher from "@/app/(director)/year-switcher";
import LoadingButton from "@/components/loading-button";
import { getYearTermFeesManagementSummary } from "@/components/school-fees/action";
import { useYearTermStreamColumns } from "@/components/school-fees/columns";
import { TableHeaderSection } from "@/components/school-fees/fees-table-header-section";
import { DataTable } from "@/components/ui/data-table";
import { PARAM_NAME_ACADEMIC_YEAR, PARAM_NAME_TERM } from "@/lib/constants";
import { TermWithYearData } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface ListOfGeneralRecordsProps {
  terms: TermWithYearData[];
  termName: string;
}
export default function ListOfGeneralRecords({
  terms,
  termName,
}: ListOfGeneralRecordsProps) {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const year = searchParams.get(PARAM_NAME_ACADEMIC_YEAR) ?? undefined;
  const termId = searchParams.get(PARAM_NAME_TERM) ?? undefined;

  const { data, status, error, isFetching, refetch } = useQuery({
    queryKey: yearTermStreamsQueryKey(year, termId),
    queryFn: async () =>
      await getYearTermFeesManagementSummary({ year, termId }),
  });

  if (status === "error") {
    console.error(error);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-3">
        <YearSwitcher />
        <TermSwitcher />
      </div>
      <div className="space-y-1">
        <h1 className="text-xl">
          School fees records{" "}
          <span className="text-muted-foreground">
            ({!data ? "..." : formatNumber(data.length)})
          </span>
        </h1>
        <p
          className={cn(
            !!data ? "visible text-sm text-muted-foreground" : "invisible",
          )}
        >
          Showing results from{" "}
          <cite>
            {`year ${year}` || "All years"}, and {termName}
          </cite>
        </p>
      </div>
      {status === "pending" ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <Loader2Icon className="size-4 animate-spin" />
          <p className="max-w-sm text-center text-muted-foreground">
            Fetching list, please wait
          </p>
        </div>
      ) : status === "error" ? (
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
      ) : status === "success" && !data.length ? (
        <div className="flex min-h-96 flex-col items-center justify-center gap-4">
          <p className="max-w-sm text-center text-muted-foreground">
            There are no registered defaulters in the system yet
          </p>
        </div>
      ) : (
        <DataTable
          columns={useYearTermStreamColumns(true)}
          data={data}
          ROWS_PER_TABLE={5}
          filterColumn={{ id: "classStream_class_class_name", label: "Class" }}
          tableHeaderSection={
            <TableHeaderSection terms={data} termName={termName} />
          }
        />
      )}
    </div>
  );
}

export function ListOfDefaUltersFallback() {
  // TODO: implement the function body.
  return <div>Loading</div>;
}
