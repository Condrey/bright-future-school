"use server";

import prisma from "@/lib/prisma";
import { libraryBookDataInclude } from "@/lib/types";
import {
  libraryAssetCategorySchema,
  LibraryAssetCategorySchema,
  libraryAssetSchema,
  LibraryAssetSchema,
} from "@/lib/validation";

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
  const {
    asset,
    title,
    quantity,
    status,
    trackQuantity,
    unit,
    author,
    category,
    isbn,
  } = libraryAssetSchema.parse(input);
  const data = await prisma.libraryBook.create({
    data: {
      title,
      quantity: quantity || 0,
      status,
      trackQuantity,
      unit,
      author,
      isbn,
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
    },
    include: libraryBookDataInclude,
  });
  return data;
}
