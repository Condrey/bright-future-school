"use server";

import prisma from "@/lib/prisma";
import {
  generalStoreItemDataInclude,
  individualGeneralStoreItemDataInclude,
} from "@/lib/types";
import {
  IndividualGeneralStoreSchema,
  individualGeneralStoreSchema,
  itemSchema,
  ItemSchema,
} from "@/lib/validation";
import {
  AssetCondition,
  AssetItemStatus,
  IndividualGeneralStoreItem,
} from "@prisma/client";
import cuid from "cuid";

export async function getIndividualGeneralStoreItem(id: string) {
  const data = await prisma.individualGeneralStoreItem.findUnique({
    where: { id },
    include: individualGeneralStoreItemDataInclude,
  });

  return data;
}

export async function getIndividualGeneralStoreItems(id: string) {
  const data = await prisma.generalStoreItem.findUnique({
    where: { id },
    include: generalStoreItemDataInclude,
  });

  return data?.individualGeneralStoreItems || [];
}

export async function getGeneralStoreItem(id: string) {
  const data = await prisma.generalStoreItem.findUnique({
    where: { id },
    include: generalStoreItemDataInclude,
  });

  return data;
}

export async function updateIndividualItem(
  input: IndividualGeneralStoreSchema,
) {
  const {
    condition,
    status,
    id,
    uniqueIdentifier,
    generalStoreItemId: generalStoreId,
  } = individualGeneralStoreSchema.parse(input);
  const data = await prisma.individualGeneralStoreItem.update({
    where: { id },
    data: {
      condition,
      status,
      uniqueIdentifier,
    },
    include: individualGeneralStoreItemDataInclude,
  });
  return data;
}

export async function addSingleItem({
  input,
}: {
  input: IndividualGeneralStoreItem;
}) {
  const data = await prisma.$transaction(
    async (tx) => {
      await tx.generalStoreItem.update({
        where: { id: input.generalStoreItemId },
        data: { quantity: { increment: 1 } },
      });
      const data = await tx.individualGeneralStoreItem.create({
        data: { ...input },
        include: individualGeneralStoreItemDataInclude,
      });
      return data;
    },
    { maxWait: 60000, timeout: 60000 },
  );
}

export async function addMultipleItem(input: ItemSchema) {
  const { parentId, quantity } = itemSchema.parse(input);
  const data = await prisma.generalStoreItem.update({
    where: { id: parentId },
    data: {
      quantity: { increment: quantity },
      individualGeneralStoreItems: {
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
  generalStoreItemId,
}: {
  id: string;
  generalStoreItemId: string;
}) {
  console.log("generalStoreItemId: ", generalStoreItemId, "id: ", id);
  const data = await prisma.$transaction(async (tx) => {
    await tx.generalStoreItem.update({
      where: { id: generalStoreItemId },
      data: { quantity: { decrement: 1 } },
    });
    const data = await tx.individualGeneralStoreItem.delete({
      where: { id },
    });
    return data;
  });
  return data.id;
}
