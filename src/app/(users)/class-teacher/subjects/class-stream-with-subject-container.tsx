"use client";

import { useSession } from "@/app/session-provider";
import FormAddViewSubjects from "@/components/subjects/form-add-view-subject/form-add-view-subjects";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AssignClassTeacher from "@/components/users/class-teacher/assign-class-teacher";
import { YearContainer } from "@/components/year-container";
import { myPrivileges } from "@/lib/enums";
import { ClassStreamData, SubjectData } from "@/lib/types";
import { Role } from "@prisma/client";
import { useState } from "react";

interface ClassStreamWithSubjectContainerProps {
  classStream: ClassStreamData;
}
export function ClassStreamWithSubjectContainer({
  classStream,
}: ClassStreamWithSubjectContainerProps) {
  const { stream, class: classValue, classTeacher } = classStream;
  const year = classValue?.academicYear?.year;

  const { user } = useSession();
  const isAuthorized = myPrivileges[user.role].includes(Role.DIRECTOR);
  const [open, setOpen] = useState(false);
  const [openSubjectDialog, setOpenSubjectDialog] = useState(false);

  return (
    <Card>
      {/* Class information  */}
      <CardHeader className="space-y-0.5">
        <CardTitle className="font-bold capitalize tracking-tight">
          <YearContainer year={year} /> {classValue?.class?.slug} {stream?.name}{" "}
          ({classValue?.class?.level?.name} level)
        </CardTitle>
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
      {/* List of Subjects  */}
      <CardContent className="space-y-1">
        {classValue?.academicYearSubjects.map(({ subject }) => {
          return <SubjectContainer key={subject.id} subject={subject} />;
        })}
      </CardContent>
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
          variant={
            classValue?._count.academicYearSubjects! > 0
              ? "secondary"
              : "default"
          }
          onClick={() => setOpenSubjectDialog(true)}
        >
          {classValue?._count.academicYearSubjects! > 0 ? "Update" : "Add"}{" "}
          subjects
        </Button>

        <FormAddViewSubjects
          classStream={classStream}
          open={openSubjectDialog}
          setOpen={setOpenSubjectDialog}
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

interface SubjectContainerProps {
  subject: SubjectData;
}

function SubjectContainer({ subject }: SubjectContainerProps) {
  const { code, subjectName, slug } = subject;
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-1">
      <h3 className="text-sm capitalize">
        <span className="text-accent-foreground">{code}</span> {subjectName} (
        {slug})
      </h3>
    </div>
  );
}
