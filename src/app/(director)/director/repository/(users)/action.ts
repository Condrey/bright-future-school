"use server";

import prisma from "@/lib/prisma";
import {
  getClassTeacherWithYearDataInclude,
  getPupilsWithYearDataInclude,
  PupilData,
} from "@/lib/types";
import { StaffType } from "@prisma/client";

export async function getClassTeachers(year: string) {
  const teachingStaffs = await prisma.staff.findMany({
    where: { staffType: StaffType.TEACHING_STAFF },
    orderBy: { user: { name: "asc" } },
    include: getClassTeacherWithYearDataInclude(year),
  });

  return teachingStaffs;
}

export async function getClassPupils(
  year: string,
  classId: string,
  streamId: string,
) {
  const data = await prisma.academicYear.findMany({
    where: { year },
    select: getPupilsWithYearDataInclude(classId, streamId),
  });
  const pupils: PupilData[] = data.flatMap((d) =>
    d.academicYearClasses.flatMap((a) => a.streams.flatMap((s) => s.pupils)),
  );

  return pupils;
}
