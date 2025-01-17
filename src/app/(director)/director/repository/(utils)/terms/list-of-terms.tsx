"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Term } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Terminal } from "lucide-react";
import { getTermsAction } from "./action";
import { useTermColumns } from "./columns";

interface ListOfTermsProps {
  terms: Term[];
}

export default function ListOfTerms({ terms }: ListOfTermsProps) {
  const { data, status, error, refetch } = useQuery({
    queryKey: ["terms"],
    queryFn: getTermsAction,
    initialData: terms,
  });
  if (status === "error") {
    console.error(error);
    return (
      <div className="flex flex-col gap-4">
        <span>Error fetching terms. Please try again</span>
        <Button onClick={() => refetch()}>Refetch</Button>
      </div>
    );
  }
  if (status === "success" && !data.length) {
    return (
      <div className="flex size-full justify-center">
        <Alert variant="destructive" className="h-fit max-w-sm">
          <Terminal className="size-4" />
          <AlertTitle>Heads up! (Step 4 of 5)</AlertTitle>
          <AlertDescription>
            Please add new terms to the database.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  return (
    <DataTable
      columns={useTermColumns}
      data={data}
      filterColumn={{ id: "term" }}
      ROWS_PER_TABLE={10}
    />
  );
}
