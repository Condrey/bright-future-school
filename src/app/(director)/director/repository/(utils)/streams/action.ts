"use server";

import prisma from "@/lib/prisma";
import { streamSchema, StreamSchema } from "@/lib/validation";

export async function getStreamsAction() {
  const streams = await prisma.stream.findMany({
    orderBy: { name: "asc" },
  });
  return streams;
}
export async function addStreamAction(input: StreamSchema) {
  const { name } = streamSchema.parse(input);

  const data = await prisma.stream.create({
    data: {
      name,
    },
  });
  return data;
}

export async function editStreamAction(input: StreamSchema) {
  const { name, id } = streamSchema.parse(input);
  const data = await prisma.stream.update({
    where: { id },
    data: {
      name,
    },
  });
  return data;
}

export async function deleteStreamAction(id: string) {
  const data = await prisma.stream.delete({ where: { id } });
  return data.id;
}
