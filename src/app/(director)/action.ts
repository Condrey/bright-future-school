"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { DirectorDashboardParam } from "@/lib/types";
import { Role, StaffType } from "@prisma/client";
import { redirect } from "next/navigation";

export async function logoutUser() {
  const { user } = await validateRequest();
  if (!user) throw Error("Unauthorized");

  await prisma.session.deleteMany({
    where: { userId: user.id },
  });

  return redirect("/login");
}

export async function getDirectorDashboardParams(): Promise<DirectorDashboardParam> {
  const { user } = await validateRequest();
  if (!user) {
    throw Error("Unauthorized");
  }
  if (user.role === Role.SUPER_ADMIN || user.role === Role.DIRECTOR) {
    const [
      classStreams,
      levels,
      classes,
      streams,
      academicYears,
      terms,
      subjects,
      grading,
      pupils,
      teachingStaffs,
      nonTeachingStaffs,
    ] = await prisma.$transaction([
      prisma.classStream.count(),
      prisma.level.count(),
      prisma.class.count(),
      prisma.stream.count(),
      prisma.academicYear.count(),
      prisma.term.count(),
      prisma.subject.count(),
      prisma.grading.count(),
      prisma.pupil.count(),
      prisma.staff.count({ where: { staffType: StaffType.TEACHING_STAFF } }),
      prisma.staff.count({
        where: { staffType: StaffType.NON_TEACHING_STAFF },
      }),
    ]);
    return {
      classStreams,
      levels,
      classes,
      streams,
      academicYears,
      terms,
      subjects,
      grading,
      pupils,
      teachingStaffs,
      nonTeachingStaffs,
    };
  } else {
    throw Error("Unauthorized");
  }
}

export async function getPlainYears() {
  const data = prisma.academicYear.findMany();
  return data;
}

export async function getPlainTerms() {
  const data = prisma.term.findMany();
  return data;
}
