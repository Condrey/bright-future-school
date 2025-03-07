"use server";

import prisma from "@/lib/prisma";
import { AssetCategory } from "@prisma/client";

export async function getAllSubAssets() {
  const data = await prisma.asset.findMany({
    where: { category: AssetCategory.GENERAL_STORE },
    select: { name: true, id: true },
    orderBy: { name: "asc" },
  });
  return data;
}

export async function getSubAssetItems({ assetId }: { assetId: string }) {
  const data = await prisma.generalStoreItem.findMany({
    where: { assetId },
    select: {
      name: true,
      asset: { select: { description: true, name: true } },
      id: true,
    },
  });
  return data;
}
