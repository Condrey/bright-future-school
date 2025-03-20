"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { Terminal } from "lucide-react";
import { getSubjectsAction } from "@/components/subjects/subject/action";
import { useSubjectColumns } from "./columns";
import { SubjectData } from "@/lib/types";

interface ListOfSubjectsProps {
  subjects: SubjectData[];
}

export default function ListOfSubjects({ subjects }: ListOfSubjectsProps) {
  const { data, status, error, refetch } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjectsAction,
    initialData: subjects,
  });
  if (status === "error") {
    console.error(error);
    return (
      <div className="flex flex-col gap-4">
        <span>Error fetching subjects. Please try again</span>
        <Button onClick={() => refetch()}>Refetch</Button>
      </div>
    );
  }
  if (status === "success" && !data.length) {
    return (
      <div className="flex size-full justify-center">
        <Alert variant="destructive" className="h-fit max-w-sm">
          <Terminal className="size-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            Please add new subjects to the database. It is required
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  return (
    <DataTable
      columns={useSubjectColumns}
      data={data}
      filterColumn={{ id: "subjectName", label: "subject name" }}
      ROWS_PER_TABLE={10}
    />
  );
}
