"use server";

import prisma from "@/lib/prisma";
import { classDataInclude } from "@/lib/types";
import { classSchema, ClassSchema } from "@/lib/validation";

export async function getClassesAction() {
  const classes = await prisma.class.findMany({
    include: classDataInclude,
    orderBy: [{ level: { name: "asc" } }, { createdAt: "asc" }],
  });
  return classes;
}
export async function addClassAction(input: ClassSchema) {
  const { name, level } = classSchema.parse(input);

  const data = await prisma.class.create({
    data: {
      name,
      levelId: level.id,
    },
  });
  return data;
}

export async function editClassAction(input: ClassSchema) {
  const { name, id, level } = classSchema.parse(input);
  const data = await prisma.class.update({
    where: { id },
    data: {
      name,
      levelId: level.id,
    },
  });
  return data;
}

export async function deleteClassAction(id: string) {
  const data = await prisma.class.delete({ where: { id } });
  return data.id;
}
