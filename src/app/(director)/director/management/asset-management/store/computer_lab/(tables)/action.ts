"use server";

import prisma from "@/lib/prisma";
import { computerLabItemDataInclude } from "@/lib/types";

export async function getAllComputerAssetItems() {
  const data = await prisma.computerLabItem.findMany({
    include: computerLabItemDataInclude,
  });
  return data;
}
