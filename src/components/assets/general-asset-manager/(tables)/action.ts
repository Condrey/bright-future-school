"use server";

import prisma from "@/lib/prisma";
import { generalStoreItemDataInclude } from "@/lib/types";

export async function getAllGeneralStoreAssetItems() {
  const data = await prisma.generalStoreItem.findMany({
    include: generalStoreItemDataInclude,
  });
  return data;
}

export async function deleteGeneralStoreItem(id: string) {
  const data = await prisma.generalStoreItem.delete({ where: { id } });
  return data.id;
}
