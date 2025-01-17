"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Stream } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Terminal } from "lucide-react";
import { getStreamsAction } from "./action";
import { useStreamColumns } from "./columns";

interface ListOfStreamsProps {
  streams: Stream[];
}

export default function ListOfStreams({ streams }: ListOfStreamsProps) {
  const { data, status, error, refetch } = useQuery({
    queryKey: ["streams"],
    queryFn: getStreamsAction,
    initialData: streams,
  });
  if (status === "error") {
    console.error(error);
    return (
      <div className="flex flex-col gap-4">
        <span>Error fetching streams. Please try again</span>
        <Button onClick={() => refetch()}>Refetch</Button>
      </div>
    );
  }
  if (status === "success" && !data.length) {
    return (
      <div className="flex size-full justify-center">
        <Alert variant="destructive" className="h-fit max-w-sm">
          <Terminal className="size-4" />
          <AlertTitle>Heads up! (Step 3 of 5)</AlertTitle>
          <AlertDescription>
            Please add new streams to the database. It is required
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  return (
    <DataTable
      columns={useStreamColumns}
      data={data}
      filterColumn={{ id: "name" }}
      ROWS_PER_TABLE={10}
    />
  );
}
