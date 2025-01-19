"use client";

import LoadingButton from "@/components/loading-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useFetchClassTeachers } from "../../../hooks";
import ButtonNewTeachingStaff from "../../../teaching-staffs/button-new-teaching-staff";
import { useClassTeachersColumn } from "./columns";

interface ListOfClassTeachersProps {
  classStreamId: string;
  year: string;
}
export default function ListOfClassTeachers({
  classStreamId,
  year,
}: ListOfClassTeachersProps) {
  const { data, status, error, refetch, isFetching } = useFetchClassTeachers({
    year,
  });

  if (status === "error") {
    console.error(error);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <ButtonNewTeachingStaff
          buttonLabel="+ new teacher"
          className={buttonVariants({ variant: "secondary" })}
        />
      </div>
      <hr />
      {status === "pending" ? (
        <div className="flex size-full flex-col items-center justify-center">
          <Loader2 className="animate-spin" />
          <p className="text-muted-foreground">Fetching teaching staffs</p>
        </div>
      ) : status === "error" ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <span className="text-muted-foreground">
            Error fetching teaching Staffs. Please try again
          </span>
          <LoadingButton loading={isFetching} onClick={() => refetch()}>
            Refetch
          </LoadingButton>
        </div>
      ) : status === "success" && !data.length ? (
        <div className="flex size-full justify-center">
          <Alert className="h-fit max-w-sm">
            <AlertTriangle className="size-4" />
            <AlertTitle>Missing Staffs.!</AlertTitle>
            <AlertDescription>
              You do not have teaching staffs in the database from where to
              choose a class teacher from.
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <DataTable
          columns={useClassTeachersColumn({
            classStreamId,
            year,
          })}
          data={data}
          filterColumn={{ id: "user_name", label: "teacher" }}
          ROWS_PER_TABLE={5}
        />
      )}
    </div>
  );
}
