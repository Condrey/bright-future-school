"use client";

import LoadingButton from "@/components/loading-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumber } from "@/lib/utils";
import { Grading } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { getAllGrading } from "@/components/gradings/grading/action";
import ButtonAddEditGrading from "@/components/gradings/grading/button-add-edit-grading";
import ButtonDeleteGrading from "@/components/gradings/grading/button-delete-grading";
import { useGetAllGradingWithInitialData } from "@/components/gradings/grading/hooks";

interface ListOfGradingProps {
  grading: Grading[];
}

export default function ListOfGrading({ grading }: ListOfGradingProps) {
  const { data, status, error, refetch, isFetching } =
    useGetAllGradingWithInitialData(grading);

  if (status === "error") {
    console.log(error);
    return (
      <div className="flex min-h-[20rem] flex-col items-center justify-center gap-4">
        <span className="text-muted-foreground max-w-sm text-center">
          An error occurred while fetching the default grading. Please try
          again.
        </span>
        <LoadingButton
          loading={isFetching}
          onClick={() => refetch()}
          className="max-w-fit"
          variant={"secondary"}
        >
          Refresh
        </LoadingButton>
      </div>
    );
  }
  if (status === "success" && !data.length) {
    return (
      <div className="flex min-h-[20rem] flex-col items-center justify-center gap-4">
        <span className="text-muted-foreground max-w-sm text-center">
          There are no custom grading added in the system yet. Please add.
        </span>
        <ButtonAddEditGrading />
      </div>
    );
  }
  return (
    <div>
      <Table className="w-full max-w-4xl rounded-md border p-4">
        <TableHeader className="bg-card text-card-foreground">
          <TableRow className="divide-x *:text-center">
            <TableHead>#</TableHead>
            <TableHead>Marks(From - To)</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Remarks</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(({ id, from, to, grade, remarks }, index, list) => {
            const currentGrade = list[index];
            return (
              <TableRow key={id} className="divide-x *:text-center">
                <TableCell className="text-muted-foreground">
                  {formatNumber(index + 1)}
                </TableCell>
                <TableCell>
                  {from} to {to}
                </TableCell>
                <TableCell className="font-bold">{grade}</TableCell>
                <TableCell className="italic">{remarks}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <ButtonAddEditGrading
                      gradingToEdit={currentGrade}
                      disPlayAsIcon
                    />
                    <ButtonDeleteGrading grading={currentGrade} />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
