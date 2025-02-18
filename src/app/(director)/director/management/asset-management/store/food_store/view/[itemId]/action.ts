"use server";

import prisma from "@/lib/prisma";
import {
  foodStoreConsumptionDataInclude,
  foodStoreItemDataInclude,
  individualFoodStoreItemDataInclude,
} from "@/lib/types";
import {
  foodConsumptionSchema,
  FoodConsumptionSchema,
  IndividualFoodStoreSchema,
  individualFoodStoreSchema,
  itemSchema,
  ItemSchema,
} from "@/lib/validation";

export async function getFoodStoreItemConsumptions(foodStoreItemId: string) {
  const data = await prisma.foodConsumption.findMany({
    where: { foodStoreItemId },
    include: foodStoreConsumptionDataInclude,
  });

  return data;
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
  foodStoreItemId,
}: {
  foodStoreItemId: string;
}) {
  await prisma.foodStoreItem.update({
    where: { id: foodStoreItemId },
    data: { quantity: { increment: 1 } },
  });
}

export async function addMultipleItem(input: ItemSchema) {
  const { parentId, quantity } = itemSchema.parse(input);
  const data = await prisma.foodStoreItem.update({
    where: { id: parentId },
    data: {
      quantity: { increment: quantity },
    },
  });
  return data;
}

export async function consumeFoodStoreItem(input: FoodConsumptionSchema) {
  const { foodStoreItemId, quantityUsed, usageDetails } =
    foodConsumptionSchema.parse(input);
  const data = await prisma.foodStoreItem.update({
    where: { id: foodStoreItemId },
    data: {
      quantity: { decrement: quantityUsed },
      consumptions: {
        create: {
          quantityUsed,
          usageDetails,
        },
      },
    },
  });
  return data;
}

export async function undoFoodStoreItemConsumption(input: FoodConsumptionSchema) {
  const { foodStoreItemId, quantityUsed, id } =
    foodConsumptionSchema.parse(input);
  const data = await prisma.foodStoreItem.update({
    where: { id: foodStoreItemId },
    data: {
      quantity: { increment: quantityUsed },
      consumptions: {
       delete:{id}
      },
    },
  });
  return data;
}

