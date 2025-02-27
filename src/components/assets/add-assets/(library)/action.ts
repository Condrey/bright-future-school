"use server";

import prisma from "@/lib/prisma";
import { libraryBookDataInclude } from "@/lib/types";
import {
  libraryAssetCategorySchema,
  LibraryAssetCategorySchema,
  libraryAssetSchema,
  LibraryAssetSchema,
} from "@/lib/validation";
import { BookStatus } from "@prisma/client";
import cuid from "cuid";

export async function getAllLibraryAssetCategory() {
  const data = await prisma.libraryBookCategory.findMany({
    orderBy: { category: "asc" },
  });
  return data;
}
export async function createLibraryAssetCategory(
  input: LibraryAssetCategorySchema,
) {
  const { category, description } = libraryAssetCategorySchema.parse(input);
  const data = await prisma.libraryBookCategory.create({
    data: { category, description },
  });
  return data;
}

export async function getAllLibraryAssetItems() {
  const data = await prisma.libraryBook.findMany({
    orderBy: { updatedAt: "desc" },
    include: libraryBookDataInclude,
  });
  return data;
}

export async function createLibraryAssetItem(input: LibraryAssetSchema) {
  const { asset, title, quantity, trackQuantity, unit, author, category } =
    libraryAssetSchema.parse(input);
  const uniqueId = cuid();
  const data = await prisma.libraryBook.create({
    data: {
      title,
      quantity: quantity || 0,
      trackQuantity,
      unit,
      author,
      category: {
        connectOrCreate: {
          where: { id: category.id },
          create: {
            category: category.category,
            description: category.category,
            id: category.category,
          },
        },
      },
      asset: {
        connectOrCreate: {
          where: { id: asset.id },
          create: {
            id: asset.id,
            category: asset.category,
            name: asset.name,
            description: asset.description,
          },
        },
      },
      individualBooks: {
        createMany: {
          data:
            !!quantity && quantity > 0
              ? Array.from({ length: quantity || 0 }, (_, index) => ({
                  id: `${uniqueId}=${index}`,
                  isbn: null,
                  status: BookStatus.AVAILABLE,
                }))
              : [],
        },
      },
    },
    include: libraryBookDataInclude,
  });
  return data;
}
