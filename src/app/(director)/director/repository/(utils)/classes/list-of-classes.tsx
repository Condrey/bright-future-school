"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ClassData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Terminal } from "lucide-react";
import { getClassesAction } from "./action";
import { useClassColumns } from "./columns";

interface ListOfClassesProps {
  classes: ClassData[];
}

export default function ListOfClasses({ classes }: ListOfClassesProps) {
  const { data, status, error, refetch } = useQuery({
    queryKey: ["classes"],
    queryFn: getClassesAction,
    initialData: classes,
  });
  if (status === "error") {
    console.error(error);
    return (
      <div className="flex flex-col gap-4">
        <span>Error fetching classes. Please try again</span>
        <Button onClick={() => refetch()}>Refetch</Button>
      </div>
    );
  }
  if (status === "success" && !data.length) {
    return (
      <div className="flex size-full justify-center">
        <Alert variant="destructive" className="h-fit max-w-sm">
          <Terminal className="size-4" />
          <AlertTitle>Heads up! (Step 2 of 5)</AlertTitle>
          <AlertDescription>
            Please add new classes to the database.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  return (
    <DataTable
      columns={useClassColumns}
      data={data}
      filterColumn={{ id: "name" }}
      ROWS_PER_TABLE={10}
    />
  );
}
