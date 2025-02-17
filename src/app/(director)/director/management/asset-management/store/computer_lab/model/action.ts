"use server";

import prisma from "@/lib/prisma";

export async function getAllBrandModels() {
  const data = await prisma.computerLabItem.findMany({
    distinct: "model",
    select: { model: true },
    orderBy: { model: "asc" },
  });
  return data;
}

export async function getBrandModelSItems({ model }: { model: string }) {
  const data = await prisma.computerLabItem.findMany({
    where: { model },
  });
  return data;
}
