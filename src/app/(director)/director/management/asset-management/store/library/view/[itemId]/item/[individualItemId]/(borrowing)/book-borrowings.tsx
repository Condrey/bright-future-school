import { DataTable } from "@/components/ui/data-table";
import { BorrowerData } from "@/lib/types";
import { Fragment } from "react";
import { useBorrowerColumns } from "./columns";
import LendBorrowBook from "./lend-book";

interface BookBorrowingsProps {
  borrowers: BorrowerData[];
  individualBookId: string;
}

export default function BookBorrowings({
  borrowers,
  individualBookId,
}: BookBorrowingsProps) {
  return (
    <Fragment>
      {!borrowers.length ? (
        <div className="flex size-full min-h-[28rem] flex-col items-center justify-center gap-4">
          <p className="max-w-sm text-center text-muted-foreground">
            There are no records of borrowing recorded yet.
          </p>
          <LendBorrowBook
            isBorrowed={false}
            individualBookId={individualBookId}
            isSecondary
          />
        </div>
      ) : (
        <DataTable
          columns={useBorrowerColumns}
          data={borrowers}
          ROWS_PER_TABLE={5}
          filterColumn={{ id: "user_name", label: "name" }}
        />
      )}
    </Fragment>
  );
}
