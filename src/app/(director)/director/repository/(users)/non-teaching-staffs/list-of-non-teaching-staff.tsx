"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { StaffData as NonTeachingStaff } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { getNonTeachingStaffsAction } from "./action";
import { useNonTeachingStaffColumns } from "./columns";

interface ListOfNonTeachingStaffsProps {
  nonTeachingStaffs: NonTeachingStaff[];
}

export default function ListOfNonTeachingStaffs({
  nonTeachingStaffs,
}: ListOfNonTeachingStaffsProps) {
  const { data, status, error, refetch } = useQuery({
    queryKey: ["nonTeachingStaffs"],
    queryFn: getNonTeachingStaffsAction,
    initialData: nonTeachingStaffs,
  });
  if (status === "error") {
    console.error(error);
    return (
      <div className="flex flex-col gap-4">
        <span>Error fetching teaching Staffs. Please try again</span>
        <Button onClick={() => refetch()}>Refetch</Button>
      </div>
    );
  }
  if (status === "success" && !data.length) {
    return (
      <div className="flex size-full justify-center">
        <Alert className="h-fit max-w-sm">
          <AlertTriangle className="size-4" />
          <AlertTitle>Missing Information</AlertTitle>
          <AlertDescription>
            The database does not have any teaching staffs yet, Please add new
            teaching Staffs to the database.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  return (
    <DataTable
      columns={useNonTeachingStaffColumns}
      data={data}
      filterColumn={{ id: "user_name", label: "Name" }}
      ROWS_PER_TABLE={10}
    />
  );
}
