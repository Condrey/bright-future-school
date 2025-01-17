"use server";

import prisma from "@/lib/prisma";
import { classStreamDataInclude } from "@/lib/types";
import { Staff } from "@prisma/client";

export async function assignClassTeacher({
  classTeacher,
  streamId,
}: {
  classTeacher: Staff;
  streamId: string;
}) {
  const stream = await prisma.classStream.findUnique({
    where: { id: streamId },
  });
  if (!stream) throw Error("This stream does not exist in the database.");

  const data = await prisma.classStream.update({
    where: { id: stream.id },
    data: {
      staffId: classTeacher.id,
    },
    include: classStreamDataInclude,
  });
  return data;
}

export async function unAssignClassTeacher({ streamId }: { streamId: string }) {
  const stream = await prisma.classStream.findUnique({
    where: { id: streamId },
  });
  if (!stream) throw Error("This stream does not exist in the database.");

  const data = await prisma.classStream.update({
    where: { id: stream.id },
    data: {
      staffId: null,
    },
    include: classStreamDataInclude,
  });
  return data;
}
