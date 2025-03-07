"use client";

import { useBorrowerColumns } from "@/components/books/(borrowing)/columns";
import LoadingButton from "@/components/loading-button";
import { DataTable } from "@/components/ui/data-table";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { getAllBorrowings } from "./action";

export default function Borrowings() {
  const queryKey: QueryKey = ["lib-books", "borrowing-list"];

  const { data, status, error, refetch, isFetching } = useQuery({
    queryKey,
    queryFn: getAllBorrowings,
  });
  if (status === "error") {
    console.error(error);
  }

  return (
    <div id="borrowing">
      {status === "pending" ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <p className="max-w-sm text-center text-muted-foreground">
            loading content, please wait.
          </p>
          <Loader2Icon className="animate-spin" />
        </div>
      ) : status === "error" ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <p className="max-w-sm text-center text-muted-foreground">
            Error upon fetching borrowings.
          </p>
          <LoadingButton
            variant="destructive"
            loading={isFetching}
            onClick={() => refetch()}
          >
            Refresh
          </LoadingButton>
        </div>
      ) : status === "success" && !data?.length ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <p className="max-w-sm text-center text-muted-foreground">
            Sorry, there are no books being borrowed yet
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <h1 className="my-4 text-xl text-muted-foreground">
            Showing book borrowings
          </h1>
          <DataTable
            columns={useBorrowerColumns}
            data={data}
            ROWS_PER_TABLE={5}
            filterColumn={{ id: "user_name", label: "borrower" }}
          />
        </div>
      )}
    </div>
  );
}
