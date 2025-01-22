"use client";

import LoadingButton from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ClassStreamData, PupilData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import AssignPupils from "../../../repository/(users)/students/(tables)/(pupils)/assign-pupils";
import { getStreamPupils } from "../action";
import { usePupilColumns } from "./column";

interface ListOfPupilsProps {
  pupils: PupilData[];
  classStream: ClassStreamData;
  classTermId: string;
}

export default function ListOfPupils({
  pupils,
  classStream,
  classTermId,
}: ListOfPupilsProps) {
  const [open, setOpen] = useState(false);
  const { data, status, isFetching, refetch } = useQuery({
    queryKey: ["pupils", "classStream", classStream.id],
    queryFn: async () =>
      getStreamPupils({ classStreamId: classStream.id, classTermId }),
    initialData: pupils,
  });
  return (
    <>
      <div className="size-full space-y-4">
        <div className="flex w-full gap-4">
          <span className="hidden md:flex">List of pupils/ students</span>
          <Button
            variant={"outline"}
            onClick={() => setOpen(true)}
            className="ms-auto"
          >
            + Pupil/ student
          </Button>
        </div>

        {status === "error" ? (
          <div className="flex size-full flex-col items-center justify-center">
            <LoadingButton
              loading={isFetching}
              onClick={() => refetch()}
              variant={"destructive"}
              className="w-fit"
            >
              Refresh
            </LoadingButton>
            <span className="text-muted-foreground">
              An error occurred while fetching this term
            </span>
          </div>
        ) : status === "success" && !data.length ? (
          <div className="flex size-full flex-col items-center justify-center gap-4">
            <p className="text-muted-foreground">
              There are no assigned pupils/ students
            </p>
            <Button
              onClick={() => setOpen(true)}
              variant={"secondary"}
              className="w-fit"
            >
              Assign pupils/ students
            </Button>
          </div>
        ) : (
          <DataTable
            columns={usePupilColumns({
              classTermId,
              feesAmount:
                data.flatMap((d) =>
                  d.fees.flatMap((f) => f.term.feesAmount),
                )[0] || 0,
            })}
            data={data}
            ROWS_PER_TABLE={5}
            filterColumn={{ id: "user_name", label: "pupil/ student" }}
          />
        )}
      </div>
      <AssignPupils
        classStream={classStream}
        year={classStream.class?.academicYear?.year!}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}
