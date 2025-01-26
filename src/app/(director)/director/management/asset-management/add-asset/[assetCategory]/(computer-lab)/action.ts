"use server";

import prisma from "@/lib/prisma";
import { computerLabItemDataInclude } from "@/lib/types";
import {
  computerLabAssetSchema,
  ComputerLabAssetSchema,
} from "@/lib/validation";

export async function getAllComputerLabAssetItems() {
  const data = await prisma.computerLabItem.findMany({
    orderBy: { updatedAt: "desc" },
    include: computerLabItemDataInclude,
  });
  return data;
}

export async function createComputerLabAssetItem(
  input: ComputerLabAssetSchema,
) {
  const {
    asset,
    name,
    quantity,
    status,
    trackQuantity,
    unit,
    condition,
    model,
    specification,
  } = computerLabAssetSchema.parse(input);
  const data = await prisma.computerLabItem.create({
    data: {
      name,
      quantity: quantity || 0,
      status,
      trackQuantity,
      unit,
      condition,
      model,
      specification,
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
    include: computerLabItemDataInclude,
  });
  return data;
}
