"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { LevelData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Terminal } from "lucide-react";
import { useLevelColumns } from "./columns";
import {
  useGetAllLevelsQuery,
  useGetAllLevelsWithInitialDataQuery,
} from "@/components/levels/level/hooks";

interface ListOfLevelsProps {
  levels: LevelData[];
}

export default function ListOfLevels({ levels }: ListOfLevelsProps) {
  const { data, status, error, refetch } =
    useGetAllLevelsWithInitialDataQuery(levels);
  if (status === "error") {
    console.error(error);
    return (
      <div className="flex flex-col gap-4">
        <span>Error fetching levels. Please try again</span>
        <Button onClick={() => refetch()}>Refetch</Button>
      </div>
    );
  }
  if (status === "success" && !data.length) {
    return (
      <div className="flex size-full justify-center">
        <Alert variant="destructive" className="h-fit max-w-sm">
          <Terminal className="size-4" />
          <AlertTitle>Heads up! (Step 1 of 5)</AlertTitle>
          <AlertDescription>
            Please add new levels to the database. It seems that you do not have
            any.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  return (
    <DataTable
      columns={useLevelColumns}
      data={data}
      filterColumn={{ id: "name" }}
      ROWS_PER_TABLE={10}
    />
  );
}
