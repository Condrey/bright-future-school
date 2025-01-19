"use server";

import prisma from "@/lib/prisma";
import { ClassStreamData, classStreamDataInclude } from "@/lib/types";
import { Staff } from "@prisma/client";

export async function assignClassTeacher({
  classTeacher,
  classStreamId,
}: {
  classTeacher: Staff;
  classStreamId: string;
}) {
  const classStream = await prisma.classStream.findUnique({
    where: { id: classStreamId },
  });
  if (!classStream) throw Error("This stream does not exist in the database.");

  const data: ClassStreamData = await prisma.classStream.update({
    where: { id: classStream.id },
    data: {
      staffId: classTeacher.id,
    },
    include: classStreamDataInclude,
  });
  return data;
}

export async function unAssignClassTeacher({
  classTeacherId,
  classStreamId,
}: {
  classTeacherId: string;
  classStreamId: string;
}) {
  const classStream = await prisma.classStream.findUnique({
    where: { id: classStreamId },
  });
  if (!classStream) throw Error("This stream does not exist in the database.");

  const data: ClassStreamData = await prisma.classStream.update({
    where: { id: classStream.id },
    data: {
      staffId: null,
    },
    include: classStreamDataInclude,
  });
  return data;
}
