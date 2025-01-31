"use server";

import prisma from "@/lib/prisma";
import { computerLabItemDataInclude, individualComputerLabItemDataInclude } from "@/lib/types";

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

  return data?.individualComputerLabItems||[];
}

export async function getComputerLabItem(id: string) {
  const data = await prisma.computerLabItem.findUnique({
    where: { id },
    include: computerLabItemDataInclude,
  });

  return data;
}

