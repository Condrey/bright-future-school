"use server";

import prisma from "@/lib/prisma";
import { computerLabItemDataInclude } from "@/lib/types";

export async function getAllComputerAssetItems() {
  const data = await prisma.computerLabItem.findMany({
    include: computerLabItemDataInclude,
  });
  return data;
}


export async function deleteComputerLabItem(id:string){
  const data = await prisma.computerLabItem.delete({where:{id}})
  return data.id;
}