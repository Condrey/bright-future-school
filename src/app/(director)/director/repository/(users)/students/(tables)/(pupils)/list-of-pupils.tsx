"use client";

import LoadingButton from "@/components/loading-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useFetchPupils } from "../../../../../../../../components/users/hooks";
import DropDownMenuNewPupil from "./(new-pupils)/drop-down-menu-new-pupil";
import { usePupilsColumn } from "./columns";

interface ListOfPupilsProps {
  classStreamId: string;
  streamId: string;
  year: string;
  classId: string;
}
export default function ListOfPupils({
  classStreamId,
  year,
  classId,
  streamId,
}: ListOfPupilsProps) {
  const { data, status, error, refetch, isFetching } = useFetchPupils({
    year,
    streamId,
    classStreamId,
    classId,
  });

  if (status === "error") {
    console.error(error);
  }

  return (
    <>
      <div className="flex items-center justify-end">
        <DropDownMenuNewPupil classStreamId={classStreamId} />
      </div>
      <hr />
      {status === "pending" ? (
        <div className="flex size-full flex-col items-center justify-center">
          <Loader2 className="animate-spin" />
          <p className="text-muted-foreground">Fetching pupils</p>
        </div>
      ) : status === "error" ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <span className="text-muted-foreground">
            Error fetching pupils. Please try again
          </span>
          <LoadingButton loading={isFetching} onClick={() => refetch()}>
            Refetch
          </LoadingButton>
        </div>
      ) : status === "success" && !data.length ? (
        <div className="flex size-full justify-center">
          <Alert className="h-fit max-w-sm">
            <AlertTriangle className="size-4" />
            <AlertTitle>Missing pupils.!</AlertTitle>
            <AlertDescription>
              There are no pupils belonging to this stream yet, please add.
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <DataTable
          columns={usePupilsColumn}
          data={data}
          filterColumn={{ id: "user_name", label: "pupil/ student" }}
          ROWS_PER_TABLE={5}
        />
      )}
    </>
  );
}
