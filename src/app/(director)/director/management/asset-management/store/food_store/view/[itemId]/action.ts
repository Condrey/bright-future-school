"use server";

import prisma from "@/lib/prisma";
import {
  foodStoreItemDataInclude,
  individualFoodStoreItemDataInclude,
} from "@/lib/types";
import {
  IndividualFoodStoreSchema,
  individualFoodStoreSchema,
  itemSchema,
  ItemSchema,
} from "@/lib/validation";
import {
  AssetCondition,
  AssetItemStatus,
  IndividualFoodStoreItem,
} from "@prisma/client";
import cuid from "cuid";

export async function getIndividualFoodStoreItem(id: string) {
  const data = await prisma.individualFoodStoreItem.findUnique({
    where: { id },
    include: individualFoodStoreItemDataInclude,
  });

  return data;
}

export async function getIndividualFoodStoreItems(id: string) {
  const data = await prisma.foodStoreItem.findUnique({
    where: { id },
    include: foodStoreItemDataInclude,
  });

  return data?.individualFoodStoreItems || [];
}

export async function getFoodStoreItem(id: string) {
  const data = await prisma.foodStoreItem.findUnique({
    where: { id },
    include: foodStoreItemDataInclude,
  });

  return data;
}

export async function updateIndividualItem(input: IndividualFoodStoreSchema) {
  const {
    condition,
    status,
    id,
    uniqueIdentifier,
    foodStoreItemId: foodStoreId,
  } = individualFoodStoreSchema.parse(input);
  const data = await prisma.individualFoodStoreItem.update({
    where: { id },
    data: {
      condition,
      status,
      uniqueIdentifier,
    },
    include: individualFoodStoreItemDataInclude,
  });
  return data;
}

export async function addSingleItem({
  input,
}: {
  input: IndividualFoodStoreItem;
}) {
  const data = await prisma.$transaction(
    async (tx) => {
      await tx.foodStoreItem.update({
        where: { id: input.foodStoreItemId },
        data: { quantity: { increment: 1 } },
      });
      const data = await tx.individualFoodStoreItem.create({
        data: { ...input },
        include: individualFoodStoreItemDataInclude,
      });
      return data;
    },
    { maxWait: 60000, timeout: 60000 },
  );
}

export async function addMultipleItem(input: ItemSchema) {
  const { parentId, quantity } = itemSchema.parse(input);
  const data = await prisma.foodStoreItem.update({
    where: { id: parentId },
    data: {
      quantity: { increment: quantity },
      individualFoodStoreItems: {
        createMany: {
          data: Array.from({ length: quantity }, (_, index) => ({
            id: `${cuid()}==${index}`,
            condition: AssetCondition.NEW,
            status: AssetItemStatus.AVAILABLE,
            uniqueIdentifier: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
        },
      },
    },
  });
  return data;
}

export async function deleteIem({
  id,
  foodStoreItemId,
}: {
  id: string;
  foodStoreItemId: string;
}) {
  console.log("foodStoreItemId: ", foodStoreItemId, "id: ", id);
  const data = await prisma.$transaction(async (tx) => {
    await tx.foodStoreItem.update({
      where: { id: foodStoreItemId },
      data: { quantity: { decrement: 1 } },
    });
    const data = await tx.individualFoodStoreItem.delete({
      where: { id },
    });
    return data;
  });
  return data.id;
}
