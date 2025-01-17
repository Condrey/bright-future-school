"use server";

import prisma from "@/lib/prisma";
import { levelDataInclude } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { levelSchema, LevelSchema } from "@/lib/validation";

export async function getLevelsAction() {
  const levels = await prisma.level.findMany({
    include: levelDataInclude,
    orderBy: { name: "asc" },
  });
  return levels;
}

export async function addLevelAction(input: LevelSchema) {
  const { name } = levelSchema.parse(input);

  const data = await prisma.level.create({
    data: {
      name,
      slug: slugify(name),
    },
    include:levelDataInclude,
  });
  return data;
}

export async function editLevelAction(input: LevelSchema) {
  const { name, id } = levelSchema.parse(input);
  const data = await prisma.level.update({
    where: { id },
    data: {
      name,
      slug: slugify(name),
    },
    include:levelDataInclude,
  });
  return data;
}

export async function deleteLevelAction(id: string) {
  const data = await prisma.level.delete({ where: { id } });
  return data.id;
}
