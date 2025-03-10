"use server";

import prisma from "@/lib/prisma";

export async function getAllSubjects() {
  const data = await prisma.subject.findMany();
  return data;
}

export const getAllAcademicYearClassSubjects = async ({
  academicYearId,
  classId,
}: {
  academicYearId: string;
  classId: string;
}) => {
  const data = await prisma.academicYearClass.findMany({
    where: { classId, academicYearId },
  });
  return data;
};
