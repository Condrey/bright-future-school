"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { webName } from "@/lib/utils";
import { AcademicYear as Year } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Terminal } from "lucide-react";
import { getYearsAction } from "./action";
import { useYearColumns } from "./columns";

interface ListOfYearsProps {
  years: Year[];
}

export default function ListOfYears({ years }: ListOfYearsProps) {
  const { data, status, error, refetch } = useQuery({
    queryKey: ["years"],
    queryFn: getYearsAction,
    initialData: years,
  });
  if (status === "error") {
    console.error(error);
    return (
      <div className="flex flex-col gap-4">
        <span>Error fetching years. Please try again</span>
        <Button onClick={() => refetch()}>Refetch</Button>
      </div>
    );
  }
  if (status === "success" && !data.length) {
    return (
      <div className="flex size-full justify-center">
        <Alert variant="destructive" className="h-fit max-w-sm">
          <Terminal className="size-4" />
          <AlertTitle>Heads up! (Step 5 of 5)</AlertTitle>
          <AlertDescription>
            Academic year is needed to complete{" "}
            <cite className="font-semibold">{webName}</cite>
            's utility set up. Please add new academic years to the database.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  return (
    <DataTable
      columns={useYearColumns}
      data={data}
      filterColumn={{ id: "year" }}
      ROWS_PER_TABLE={10}
    />
  );
}
