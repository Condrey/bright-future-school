"use client";

import AssignClassTeacher from "@/app/(director)/director/repository/(users)/students/(tables)/(class-teacher)/assign-class-teacher";
import AssignPupils from "@/app/(director)/director/repository/(users)/students/(tables)/(pupils)/assign-pupils";
import LoadingButton from "@/components/loading-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import { TermWithYearData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getClassTerm } from "../../../../../../../components/school-fees/action";
import { YearContainer } from "@/components/year-container";

interface ClassDetailsProps {
  oldTerm: TermWithYearData;
}

export default function ClassDetails({ oldTerm }: ClassDetailsProps) {
  const [open, setOpen] = useState(false);
  const [openAssignTeacherDialog, setOpenAssignTeacherDialog] = useState(false);

  const {
    data: term,
    status,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["class-term", oldTerm.id],
    queryFn: async () => getClassTerm({ classTermId: oldTerm.id }),
    initialData: oldTerm,
    staleTime: Infinity,
  });
  if (status === "error") {
    console.error(error);
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <span className="max-w-sm text-muted-foreground">
          Error occurred while fetching term details
        </span>
        <LoadingButton
          loading={isFetching}
          variant={"destructive"}
          onClick={() => refetch()}
          className="w-fit"
        >
          Refresh
        </LoadingButton>
      </div>
    );
  }
  const classStream = term.classStream;
  if (!classStream) return null;
  const classTeacher = classStream?.classTeacher?.user;
  const name = classTeacher?.name;
  const avatarUrl = classTeacher?.avatarUrl;
  const description =
    classTeacher?.telephone ||
    classTeacher?.email ||
    `@${classTeacher?.username}`;
  const pupilNumber = classStream._count.pupils || 0;
  const year = classStream?.class?.academicYear?.year;

  return (
    <>
      <div className="hidden flex-row justify-evenly gap-3 divide-x-2 rounded-md bg-card p-4 shadow-md md:flex-col md:divide-x-0 lg:flex">
        <div className="flex flex-col gap-1">
          <div className="font-bold">
            <YearContainer year={year}/>{" "}
            • {classStream.class?.class?.name} class
          </div>
          <span className="text-xs text-muted-foreground">
            {classStream.class?.class?.level?.name} level
          </span>
          <span>{classStream.stream?.name} stream</span>
          <div className="flex items-center gap-4">
            {pupilNumber === 0 ? (
              <Badge variant={"destructive"} className="hidden lg:flex">
                <span className="line-clamp-1 text-ellipsis">
                  No pupils/ students assigned
                </span>
              </Badge>
            ) : pupilNumber === 1 ? (
              "1 pupil/ students"
            ) : (
              `${formatNumber(pupilNumber)} pupils/ students`
            )}
            <Button
              className='ms-auto w-fit after:content-["New"] lg:after:content-["pupil/_student"]'
              variant={pupilNumber > 0 ? "secondary" : "default"}
              onClick={() => setOpen(true)}
            >
              +
            </Button>
          </div>
        </div>
        <hr />
        <div className="ps-2">
          <div className="font-bold">Class teacher</div>
          <div className="flex items-center gap-4">
            {!classTeacher ? (
              <Badge variant={"destructive"}>Not assigned</Badge>
            ) : (
              <div className="flex flex-wrap gap-3">
                <UserAvatar avatarUrl={avatarUrl} />
                <div className="5 flex flex-col gap-0">
                  <div>{name}</div>
                  <div className="text-xs text-muted-foreground">
                    {description}
                  </div>
                </div>
              </div>
            )}
            <Button
              className="ms-auto w-fit"
              variant={!classTeacher ? "default" : "secondary"}
              onClick={() => setOpenAssignTeacherDialog(true)}
            >
              {!classTeacher ? "Assign" : "Unassign"}
            </Button>
          </div>
        </div>
      </div>
      <AssignPupils
        classStream={classStream}
        year={classStream?.class?.academicYear?.year!}
        open={open}
        setOpen={setOpen}
      />
      <AssignClassTeacher
        classStream={classStream}
        open={openAssignTeacherDialog}
        setOpen={setOpenAssignTeacherDialog}
        year={classStream.class?.academicYear?.year!}
      />
    </>
  );
}
