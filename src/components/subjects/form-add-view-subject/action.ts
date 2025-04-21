"use server";

import prisma from "@/lib/prisma";
import { levelDataInclude } from "@/lib/types";

export async function getAllLevelsWithSubjects() {
  const data = await prisma.level.findMany({
    include: levelDataInclude,
  });
  return data;
}
