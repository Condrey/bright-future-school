"use server";

import prisma from "@/lib/prisma";
import { AssetCategory } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";

export async function getComputerLabSummary() {
  const summary = await prisma.computerLabItem.findMany({
    select: {
      id: true,
      name: true,
      individualComputerLabItems: { select: { status: true } },
    },
  });
  return summary;
}

export async function getFoodStoreItems() {
  const summary = await prisma.foodStoreItem.findMany({
    select: {
      id: true,
      foodName: true,
      status: true,
      supplier: { select: { name: true } },
      individualFoodStoreItems: { select: { status: true } },
      _count: {
        select: {
          consumptions: {
            where: {
              dateUsedAt: {
                gte: startOfDay(new Date()),
                lte: endOfDay(new Date()),
              },
            },
          },
        },
      },
    },
  });
  return summary;
}

export async function getAllGeneralStoreItems() {
  const summary = await prisma.asset.findMany({
    where: { category: AssetCategory.GENERAL_STORE },
    select: {
      generalStoreItems: {
        select: {
          id: true,
          name: true,
          status: true,
          individualGeneralStoreItems: { select: { status: true } },
        },
      },
    },
  });
  return summary;
}

export async function getAllLabItems() {
  const summary = await prisma.labItem.findMany({
    select: {
      id: true,
      name: true,
      status: true,
      individualLabItems: { select: { status: true } },
    },
  });
  return summary;
}

export async function getAllLibraryItems() {
  const data = await prisma.$transaction(async (tx) => {
    const summary = await tx.libraryBook.findMany({
      select: {
        id: true,
        title: true,
        individualBooks: { select: { status: true } },
        category: { select: { id: true } },
      },
    });
    const authors = await tx.libraryBook.groupBy({
      by: "author",
      _count: { title: true, author: true },
    });
    return { summary, authors };
  });

  return data;
}
