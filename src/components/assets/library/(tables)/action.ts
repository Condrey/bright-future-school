"use server";

import prisma from "@/lib/prisma";
import { libraryBookDataInclude } from "@/lib/types";

export async function getAllLibraryAssetItems() {
  const data = await prisma.libraryBook.findMany({
    include: libraryBookDataInclude,
  });
  return data;
}

export async function deleteLibraryItem(id: string) {
  const data = await prisma.libraryBook.delete({ where: { id } });
  return data.id;
}
