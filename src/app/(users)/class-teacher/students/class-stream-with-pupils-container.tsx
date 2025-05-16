"use client";

import AssignPupils from "@/app/(director)/director/repository/(users)/students/(tables)/(pupils)/assign-pupils";
import { useSession } from "@/app/session-provider";
import EmptyContainer from "@/components/query-containers/empty-container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import AssignClassTeacher from "@/components/users/class-teacher/assign-class-teacher";
import { YearContainer } from "@/components/year-container";
import { myPrivileges } from "@/lib/enums";
import { ClassStreamData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { Role } from "@prisma/client";
import { useState } from "react";
import { useClassTeacherPupilsColumns } from "./columns";

interface ClassStreamWithPupilsContainerProps {
  classStream: ClassStreamData;
}
export function ClassStreamWithPupilsContainer({
  classStream,
}: ClassStreamWithPupilsContainerProps) {
  const { stream, class: classValue, classTeacher, _count } = classStream;
  const year = classValue?.academicYear?.year;
  const pupils = classStream.pupils;

  const { user } = useSession();
  const isAuthorized = myPrivileges[user.role].includes(Role.DIRECTOR);
  const [open, setOpen] = useState(false);
  const [openPupilDialog, setOpenPupilDialog] = useState(false);

  return (
    <Card className="max-w-4xl">
      {/* Class information  */}
      <CardHeader className="space-y-0.5">
        <CardTitle className="font-bold tracking-tight capitalize">
          <YearContainer year={year} /> {classValue?.class?.slug} {stream?.name}{" "}
          ({classValue?.class?.level?.name} level)
        </CardTitle>
        <CardDescription className="text-sm">
          {_count.pupils === 0
            ? "No pupils/ students"
            : `${formatNumber(_count.pupils)} ${
                _count.pupils === 1 ? "Pupil/ student" : "Pupils/ students"
              }`}
        </CardDescription>
        <CardDescription>
          Class teacher:{" "}
          {classTeacher
            ? `${classTeacher?.user?.name}, ${
                classTeacher?.user?.telephone ||
                classTeacher?.user?.email ||
                `@${classTeacher?.user?.username}`
              }`
            : "Not assigned"}
        </CardDescription>
      </CardHeader>
      {/* List of Pupils  */}
      <CardContent className="space-y-1">
        {_count.pupils > 0 ? (
          <div className="flex w-full justify-center *:w-full">
            <DataTable
              data={pupils}
              columns={useClassTeacherPupilsColumns}
              filterColumn={{ id: "user_name", label: "name" }}
            />
          </div>
        ) : (
          <EmptyContainer
            message={"There are no pupils/ students for this class"}
          />
        )}
      </CardContent>
      {/* Additional Controls  */}
      <CardFooter className="flex w-full justify-end gap-4">
        {isAuthorized && (
          <Button
            size={"sm"}
            variant={classTeacher ? "destructive" : "secondary"}
            onClick={() => setOpen(true)}
          >
            {classTeacher ? "Unassign" : "Assign"} Class teacher
          </Button>
        )}
        <Button
          size={"sm"}
          variant={_count.pupils! > 0 ? "secondary" : "default"}
          onClick={() => setOpenPupilDialog(true)}
        >
          Assign pupils/ students
        </Button>

        <AssignPupils
          classStream={classStream}
          open={openPupilDialog}
          setOpen={setOpenPupilDialog}
          year={year!}
        />

        <AssignClassTeacher
          classStream={classStream}
          open={open}
          setOpen={setOpen}
          year={year!}
        />
      </CardFooter>
    </Card>
  );
}
