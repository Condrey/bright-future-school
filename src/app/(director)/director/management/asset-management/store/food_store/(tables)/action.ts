"use server";

import prisma from "@/lib/prisma";
import { foodStoreItemDataInclude } from "@/lib/types";

export async function getAllFoodStoreAssetItems() {
  const data = await prisma.foodStoreItem.findMany({
    include: foodStoreItemDataInclude,
  });
  return data;
}

export async function deleteFoodStoreItem(id: string) {
  const data = await prisma.foodStoreItem.delete({ where: { id } });
  return data.id;
}
