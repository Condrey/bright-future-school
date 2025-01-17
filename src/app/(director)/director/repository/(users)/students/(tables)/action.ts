"use server";

import prisma from "@/lib/prisma";
import { classStreamDataInclude } from "@/lib/types";
import { classStreamSchema, ClassStreamSchema } from "@/lib/validation";

export async function getClassStreamsAction() {
  const classStreams = await prisma.classStream.findMany({
    include: classStreamDataInclude,
    orderBy: [
      { class: { class: { level: { name: "asc" } } } },
      { class: { class: { createdAt: "asc" } } },
      { stream: { name: "asc" } },
    ],
  });
  return classStreams;
}

export async function addClassStreamAction(input: ClassStreamSchema) {
  const { classId, staffId, streamId } = classStreamSchema.parse(input);

  const data = await prisma.classStream.create({
    data: {
      classId,
      staffId,
      streamId,
    },
    include: classStreamDataInclude,
  });
  return data;
}

export async function editClassStreamAction(input: ClassStreamSchema) {
  const { classId, staffId, streamId, id } = classStreamSchema.parse(input);
  const data = await prisma.classStream.update({
    where: { id },
    data: {
      classId,
      staffId,
      streamId,
    },
    include: classStreamDataInclude,
  });
  return data;
}

export async function deleteClassStreamAction(id: string) {
  const data = await prisma.classStream.delete({ where: { id } });
  return data.id;
}
