"use server";

import prisma from "@/lib/prisma";
import { laboratoryItemDataInclude } from "@/lib/types";
import { laboratoryAssetSchema, LaboratoryAssetSchema } from "@/lib/validation";

export async function getAllLaboratoryAssetItems() {
  const data = await prisma.labItem.findMany({
    orderBy: { updatedAt: "desc" },
    include: laboratoryItemDataInclude,
  });
  return data;
}

export async function createLaboratoryAssetItem(input: LaboratoryAssetSchema) {
  const { asset, name, quantity, status, trackQuantity, unit } =
    laboratoryAssetSchema.parse(input);
  const data = await prisma.labItem.create({
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
    include: laboratoryItemDataInclude,
  });
  return data;
}
