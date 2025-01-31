"use server";

import prisma from "@/lib/prisma";
import {
  computerLabItemDataInclude,
  individualComputerLabItemDataInclude,
} from "@/lib/types";
import { itemSchema, ItemSchema } from "@/lib/validation";
import {
  AssetCondition,
  AssetItemStatus,
  IndividualComputerLabItem,
} from "@prisma/client";

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

export async function addSingleItem({
  input,
}: {
  input: IndividualComputerLabItem;
}) {
  const data = await prisma.individualComputerLabItem.create({
    data: input,
    include: individualComputerLabItemDataInclude,
  });
}

export async function addMultipleItem(input: ItemSchema) {
  const { parentId, quantity } = itemSchema.parse(input);
  const data = await prisma.computerLabItem.update({
    where: { id: parentId },
    data: {
      individualComputerLabItems: {
        createMany: {
          data: Array.from({ length: quantity }, (_, index) => ({
            id: `${parentId}==${index}`,
            computerLabItemId: parentId,
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
