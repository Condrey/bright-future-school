"use server";

import prisma from "@/lib/prisma";
import { laboratoryItemDataInclude } from "@/lib/types";

export async function getAllLaboratoryAssetItems() {
  const data = await prisma.labItem.findMany({
    include: laboratoryItemDataInclude,
  });
  return data;
}

export async function deleteLaboratoryItem(id: string) {
  const data = await prisma.labItem.delete({ where: { id } });
  return data.id;
}
