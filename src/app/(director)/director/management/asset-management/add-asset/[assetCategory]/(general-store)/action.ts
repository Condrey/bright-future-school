"use server";

import prisma from "@/lib/prisma";
import { assetDataInclude, generalStoreItemDataInclude } from "@/lib/types";
import {
  AssetSchema,
  assetSchema,
  generalStoreAssetSchema,
  GeneralStoreAssetSchema,
} from "@/lib/validation";
import { AssetCategory, AssetCondition, AssetStatus } from "@prisma/client";
import cuid from "cuid";

export async function getAllAssets() {
  const data = await prisma.asset.findMany({
    where: { category: AssetCategory.GENERAL_STORE },
    orderBy: { name: "asc" },
    include: assetDataInclude,
  });
  return data;
}

export async function createAsset(input: AssetSchema) {
  const { category, name, description } = assetSchema.parse(input);
  const data = await prisma.asset.create({
    data: {
      category,
      name,
      description,
    },
    include: assetDataInclude,
  });
  return data;
}
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
  const uniqueId = cuid();

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
      individualGeneralStoreItems: {
        createMany: {
          data:
            trackQuantity && !!quantity && quantity > 0
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
    include: generalStoreItemDataInclude,
  });
  return data;
}
