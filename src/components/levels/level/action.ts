'use server'

import prisma from "@/lib/prisma";
import { levelDataInclude } from "@/lib/types";

export async function getLevelsAction() {
  const levels = await prisma.level.findMany({
    include: levelDataInclude,
    orderBy: { name: "asc" },
  });
  return levels;
}
