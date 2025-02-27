"use server";

import prisma from "@/lib/prisma";

export async function getAllFoodStoreSuppliers() {
  const data = await prisma.supplier.findMany({
    select: { name: true, contactInfo: true, id: true },
    orderBy: { name: "asc" },
  });
  return data;
}

export async function getSupplierSFoodItems({
  supplierId,
}: {
  supplierId: string;
}) {
  const data = await prisma.foodStoreItem.findMany({
    where: { supplierId },
    select: { id: true, isConsumable: true, foodName: true },
  });
  return data;
}
