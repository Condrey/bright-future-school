"use server";

import prisma from "@/lib/prisma";
import { assetDataInclude } from "@/lib/types";
import { assetSchema, AssetSchema } from "@/lib/validation";

export async function getAllAssets() {
  const data = await prisma.asset.findMany({
    orderBy: { category: "asc" },
    include: assetDataInclude,
  });
  return data;
}

export async function addAsset(input: AssetSchema) {
  const { category, name, description } = assetSchema.parse(input);
  const data = await prisma.asset.create({
    data: {
      category,
      name,
      description,
    },
    include: assetDataInclude,
  });
  return data;
}

export async function updateAsset(input: AssetSchema) {
  const { category, name, description, id } = assetSchema.parse(input);
  const data = await prisma.asset.update({
    where: { id },
    data: {
      category,
      name,
      description,
    },
    include: assetDataInclude,
  });
  return data;
}

export async function deleteAsset(id: string) {
  const data = await prisma.asset.delete({
    where: { id },
    include: assetDataInclude,
  });
  return data.id;
}
