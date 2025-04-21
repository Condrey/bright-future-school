"use server";

import prisma from "@/lib/prisma";
import { ClassStreamData, classStreamDataInclude } from "@/lib/types";
import { Role, Staff } from "@prisma/client";

export async function assignClassTeacher({
  classTeacher,
  classStreamId,
}: {
  classTeacher: Staff;
  classStreamId: string;
}) {
  const data = await prisma.$transaction(
    async (tx) => {
      const classStream = await tx.classStream.findUnique({
        where: { id: classStreamId },
      });
      if (!classStream)
        throw Error("This stream does not exist in the database.");
      const data: ClassStreamData = await tx.classStream.update({
        where: { id: classStream.id },
        data: {
          staffId: classTeacher.id,
        },
        include: classStreamDataInclude,
      });
      await tx.staff.update({
        where: { id: classTeacher.id },
        data: { user: { update: { role: Role.CLASS_TEACHER } } },
      });
      return data;
    },
    { timeout: 60000, maxWait: 60000 },
  );
  return data;
}

export async function unAssignClassTeacher({
  classTeacherId,
  classStreamId,
}: {
  classTeacherId: string;
  classStreamId: string;
}) {
  const data = await prisma.$transaction(
    async (tx) => {
      const classStream = await tx.classStream.findUnique({
        where: { id: classStreamId },
      });
      if (!classStream)
        throw Error("This stream does not exist in the database.");

      const teacher = await tx.staff.findUnique({
        where: { id: classTeacherId },
        select: {
          user: { select: { role: true } },
          _count: { select: { classStreams: true } },
        },
      });
      if (!teacher) throw Error("There is no such class teacher.");

      const data: ClassStreamData = await tx.classStream.update({
        where: { id: classStream.id },
        data: {
          staffId: null,
        },
        include: classStreamDataInclude,
      });
      await tx.staff.update({
        where: { id: classTeacherId },
        data: {
          user: {
            update: {
              role:
                teacher._count.classStreams === 1
                  ? Role.STAFF
                  : teacher._count.classStreams > 1
                    ? Role.CLASS_TEACHER
                    : teacher.user?.role,
            },
          },
        },
      });
      return data;
    },
    { timeout: 60000, maxWait: 60000 },
  );
  return data;
}
