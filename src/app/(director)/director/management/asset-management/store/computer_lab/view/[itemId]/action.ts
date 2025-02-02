"use server";

import prisma from "@/lib/prisma";
import {
  computerLabItemDataInclude,
  individualComputerLabItemDataInclude,
} from "@/lib/types";
import {
  individualComputerLabItemSchema,
  IndividualComputerLabItemSchema,
  itemSchema,
  ItemSchema,
} from "@/lib/validation";
import {
  AssetCondition,
  AssetItemStatus,
  IndividualComputerLabItem,
} from "@prisma/client";
import cuid from "cuid";

export async function getIndividualComputerLabItem(id: string) {
  const data = await prisma.individualComputerLabItem.findUnique({
    where: { id },
    include: individualComputerLabItemDataInclude,
  });

  return data;
}

export async function getIndividualComputerLabItems(id: string) {
  const data = await prisma.computerLabItem.findUnique({
    where: { id },
    include: computerLabItemDataInclude,
  });

  return data?.individualComputerLabItems || [];
}

export async function getComputerLabItem(id: string) {
  const data = await prisma.computerLabItem.findUnique({
    where: { id },
    include: computerLabItemDataInclude,
  });

  return data;
}

export async function updateIndividualItem(
  input: IndividualComputerLabItemSchema,
) {
  const { computerLabItemId, condition, status, id, uniqueIdentifier } =
    individualComputerLabItemSchema.parse(input);
  const data = await prisma.individualComputerLabItem.update({
    where: { id },
    data: {
      condition,
      status,
      uniqueIdentifier,
    },
    include: individualComputerLabItemDataInclude,
  });
  return data;
}

export async function addSingleItem({
  input,
}: {
  input: IndividualComputerLabItem;
}) {
  const data = await prisma.$transaction(
    async (tx) => {
      await tx.computerLabItem.update({
        where: { id: input.computerLabItemId },
        data: { quantity: { increment: 1 } },
      });
      const data = await tx.individualComputerLabItem.create({
        data: { ...input },
        include: individualComputerLabItemDataInclude,
      });
      return data;
    },
    { maxWait: 60000, timeout: 60000 },
  );
}

export async function addMultipleItem(input: ItemSchema) {
  const { parentId, quantity } = itemSchema.parse(input);
  const data = await prisma.computerLabItem.update({
    where: { id: parentId },
    data: {
      quantity: { increment: quantity },
      individualComputerLabItems: {
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
  computerLabItemId,
}: {
  id: string;
  computerLabItemId: string;
}) {
  console.log("computerLabItemId: ", computerLabItemId, "id: ", id);
  const data = await prisma.$transaction(async (tx) => {
    await tx.computerLabItem.update({
      where: { id: computerLabItemId },
      data: { quantity: { decrement: 1 } },
    });
    const data = await tx.individualComputerLabItem.delete({
      where: { id },
    });
    return data;
  });
  return data.id;
}
