"use server";

import prisma from "@/lib/prisma";
import { generalStoreItemDataInclude } from "@/lib/types";
import {
  generalStoreAssetSchema,
  GeneralStoreAssetSchema,
} from "@/lib/validation";

export async function getAllGeneralStoreAssetItems() {
  const data = await prisma.generalStoreItem.findMany({
    orderBy: { updatedAt: "desc" },
    include: generalStoreItemDataInclude,
  });
  return data;
}

export async function createGeneralStoreAssetItem(
  input: GeneralStoreAssetSchema,
) {
  const { asset, name, quantity, status, trackQuantity, unit } =
    generalStoreAssetSchema.parse(input);
  const data = await prisma.generalStoreItem.create({
    data: {
      name,
      quantity: quantity || 0,
      status,
      trackQuantity,
      unit,
      asset: {
        connectOrCreate: {
          where: { id: asset.id },
          create: {
            id: asset.id,
            category: asset.category,
            name: asset.name,
            description: asset.description,
          },
        },
      },
    },
    include: generalStoreItemDataInclude,
  });
  return data;
}
