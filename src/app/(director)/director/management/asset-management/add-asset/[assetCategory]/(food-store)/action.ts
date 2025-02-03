"use server";

import prisma from "@/lib/prisma";
import { foodStoreItemDataInclude } from "@/lib/types";
import {
  foodStoreAssetSchema,
  FoodStoreAssetSchema,
  supplierSchema,
  SupplierSchema,
} from "@/lib/validation";
import { AssetCondition, AssetStatus } from "@prisma/client";
import cuid from "cuid";

export async function getAllFoodStoreAssetSuppliers() {
  const data = await prisma.supplier.findMany({
    orderBy: { name: "asc" },
  });
  return data;
}
export async function createFoodStoreAssetSupplier(input: SupplierSchema) {
  const { name, address, contactInfo } = supplierSchema.parse(input);
  const data = await prisma.supplier.create({
    data: { name, address, contactInfo },
  });
  return data;
}

export async function getAllFoodStoreAssetItems() {
  const data = await prisma.foodStoreItem.findMany({
    orderBy: { updatedAt: "desc" },
    include: foodStoreItemDataInclude,
  });
  return data;
}

export async function createFoodStoreAssetItem(input: FoodStoreAssetSchema) {
  const {
    asset,
    foodName,
    quantity,
    isConsumable,
    status,
    trackQuantity,
    unit,
    supplier,
  } = foodStoreAssetSchema.parse(input);
  const uniqueId = cuid();

  const data = await prisma.foodStoreItem.create({
    data: {
      foodName,
      quantity: quantity || 0,
      status,
      trackQuantity,
      unit,
      supplier: !supplier
        ? undefined
        : {
            connectOrCreate: {
              where: { id: supplier.id },
              create: {
                id: supplier.id,
                name: supplier.name,
                address: supplier.address,
                contactInfo: supplier.contactInfo,
              },
            },
          },
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
      individualFoodStoreItems: {
        createMany: {
          data:
            trackQuantity && !isConsumable && !!quantity && quantity > 0
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
    include: foodStoreItemDataInclude,
  });
  return data;
}
