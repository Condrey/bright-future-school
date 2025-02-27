"use server";

import prisma from "@/lib/prisma";
import {
  individualLaboratoryItemDataInclude,
  laboratoryItemDataInclude,
} from "@/lib/types";
import {
  IndividualLaboratorySchema,
  individualLaboratorySchema,
  itemSchema,
  ItemSchema,
} from "@/lib/validation";
import {
  AssetCondition,
  AssetItemStatus,
  IndividualLabItem,
} from "@prisma/client";
import cuid from "cuid";

export async function getIndividualLaboratoryItem(id: string) {
  const data = await prisma.individualLabItem.findUnique({
    where: { id },
    include: individualLaboratoryItemDataInclude,
  });

  return data;
}

export async function getIndividualLaboratoryItems(id: string) {
  const data = await prisma.labItem.findUnique({
    where: { id },
    include: laboratoryItemDataInclude,
  });

  return data?.individualLabItems || [];
}

export async function getLaboratoryItem(id: string) {
  const data = await prisma.labItem.findUnique({
    where: { id },
    include: laboratoryItemDataInclude,
  });

  return data;
}

export async function updateIndividualItem(input: IndividualLaboratorySchema) {
  const {
    condition,
    status,
    id,
    uniqueIdentifier,
    labItemId: laboratoryId,
  } = individualLaboratorySchema.parse(input);
  const data = await prisma.individualLabItem.update({
    where: { id },
    data: {
      condition,
      status,
      uniqueIdentifier,
    },
    include: individualLaboratoryItemDataInclude,
  });
  return data;
}

export async function addSingleItem({ input }: { input: IndividualLabItem }) {
  const data = await prisma.$transaction(
    async (tx) => {
      await tx.labItem.update({
        where: { id: input.labItemId },
        data: { quantity: { increment: 1 } },
      });
      const data = await tx.individualLabItem.create({
        data: { ...input },
        include: individualLaboratoryItemDataInclude,
      });
      return data;
    },
    { maxWait: 60000, timeout: 60000 },
  );
}

export async function addMultipleItem(input: ItemSchema) {
  const { parentId, quantity } = itemSchema.parse(input);
  const data = await prisma.labItem.update({
    where: { id: parentId },
    data: {
      quantity: { increment: quantity },
      individualLabItems: {
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
  laboratoryItemId,
}: {
  id: string;
  laboratoryItemId: string;
}) {
  console.log("laboratoryItemId: ", laboratoryItemId, "id: ", id);
  const data = await prisma.$transaction(async (tx) => {
    await tx.labItem.update({
      where: { id: laboratoryItemId },
      data: { quantity: { decrement: 1 } },
    });
    const data = await tx.individualLabItem.delete({
      where: { id },
    });
    return data;
  });
  return data.id;
}
