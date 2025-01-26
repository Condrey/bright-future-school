"use server";

import prisma from "@/lib/prisma";
import { assetDataInclude } from "@/lib/types";

export async function getAllAssets() {
  const data = await prisma.asset.findMany({
    orderBy: { category: "asc" },
    include: assetDataInclude,
  });
  return data;
}
