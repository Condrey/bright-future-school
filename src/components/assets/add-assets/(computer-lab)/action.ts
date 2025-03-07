"use server";

import prisma from "@/lib/prisma";
import { computerLabItemDataInclude } from "@/lib/types";
import {
  computerLabAssetSchema,
  ComputerLabAssetSchema,
} from "@/lib/validation";
import { AssetCondition, AssetStatus } from "@prisma/client";
import cuid from "cuid";

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
  const { asset, name, quantity, trackQuantity, unit, model, specification } =
    computerLabAssetSchema.parse(input);
  const uniqueId = cuid();
  const data = await prisma.computerLabItem.create({
    data: {
      name,
      quantity: quantity || 0,
      trackQuantity,
      unit,
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
      individualComputerLabItems: {
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
        },
      },
    },
    include: computerLabItemDataInclude,
  });
  return data;
}

export async function updateComputerLabAssetItem(
  input: ComputerLabAssetSchema,
) {
  const {
    asset,
    name,
    quantity,
    trackQuantity,
    unit,
    model,
    specification,
    id,
  } = computerLabAssetSchema.parse(input);
  const uniqueId = cuid();
  const data = await prisma.computerLabItem.update({
    where: { id },
    data: {
      name,
      quantity: quantity || 0,
      trackQuantity,
      unit,
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
      individualComputerLabItems: {
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
    include: computerLabItemDataInclude,
  });
  return data;
}
