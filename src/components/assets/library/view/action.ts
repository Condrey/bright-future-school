"use server";

import prisma from "@/lib/prisma";
import {
  individualLibraryBookDataInclude,
  libraryBookDataInclude,
} from "@/lib/types";
import {
  individualBookSchema,
  IndividualBookSchema,
  itemSchema,
  ItemSchema,
} from "@/lib/validation";
import {
  AssetCondition,
  AssetItemStatus,
  IndividualBook,
} from "@prisma/client";
import cuid from "cuid";

export async function getIndividualBook(id: string) {
  const data = await prisma.individualBook.findUnique({
    where: { id },
    include: individualLibraryBookDataInclude,
  });

  return data;
}

export async function getIndividualBooks(id: string) {
  const data = await prisma.libraryBook.findUnique({
    where: { id },
    include: libraryBookDataInclude,
  });

  return data?.individualBooks || [];
}

export async function getLibraryItem(id: string) {
  const data = await prisma.libraryBook.findUnique({
    where: { id },
    include: libraryBookDataInclude,
  });

  return data;
}

export async function updateIndividualItem(input: IndividualBookSchema) {
  const { libraryBookId, condition, status, id, isbn } =
    individualBookSchema.parse(input);
  const data = await prisma.individualBook.update({
    where: { id },
    data: {
      condition,
      status,
      isbn,
    },
    include: individualLibraryBookDataInclude,
  });
  return data;
}

export async function addSingleItem({ input }: { input: IndividualBook }) {
  const data = await prisma.$transaction(
    async (tx) => {
      await tx.libraryBook.update({
        where: { id: input.libraryBookId },
        data: { quantity: { increment: 1 } },
      });
      const data = await tx.individualBook.create({
        data: { ...input },
        include: individualLibraryBookDataInclude,
      });
      return data;
    },
    { maxWait: 60000, timeout: 60000 },
  );
}

export async function addMultipleItem(input: ItemSchema) {
  const { parentId, quantity } = itemSchema.parse(input);
  const data = await prisma.libraryBook.update({
    where: { id: parentId },
    data: {
      quantity: { increment: quantity },
      individualBooks: {
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
  libraryItemId,
}: {
  id: string;
  libraryItemId: string;
}) {
  console.log("libraryItemId: ", libraryItemId, "id: ", id);
  const data = await prisma.$transaction(async (tx) => {
    await tx.libraryBook.update({
      where: { id: libraryItemId },
      data: { quantity: { decrement: 1 } },
    });
    const data = await tx.individualBook.delete({
      where: { id },
    });
    return data;
  });
  return data.id;
}
