"use server";

import prisma from "@/lib/prisma";
import { laboratoryItemDataInclude } from "@/lib/types";
import { laboratoryAssetSchema, LaboratoryAssetSchema } from "@/lib/validation";
import { AssetCondition, AssetStatus } from "@prisma/client";
import cuid from "cuid";

export async function getAllLaboratoryAssetItems() {
  const data = await prisma.labItem.findMany({
    orderBy: { updatedAt: "desc" },
    include: laboratoryItemDataInclude,
  });
  return data;
}

export async function createLaboratoryAssetItem(input: LaboratoryAssetSchema) {
  const { asset, name, quantity, trackQuantity, unit } =
    laboratoryAssetSchema.parse(input);
  const uniqueId = cuid();

  const data = await prisma.labItem.create({
    data: {
      name,
      quantity: quantity || 0,
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
      individualLabItems: {
        createMany: {
          data:
            !!quantity && quantity > 0
              ? Array.from({ length: quantity }).map((_, index) => ({
                  id: `${uniqueId}=${index}`,
                  uniqueIdentifier: null,
                  condition: AssetCondition.NEW,
                  status: AssetStatus.AVAILABLE,
                }))
              : [],
          skipDuplicates: true,
        },
      },
    },
    include: laboratoryItemDataInclude,
  });
  return data;
}
