"use server";

import prisma from "@/lib/prisma";
import { libraryBookCategoryDataInclude } from "@/lib/types";

export async function getAllBookCategories() {
  const data = await prisma.libraryBookCategory.findMany({
    include: libraryBookCategoryDataInclude,
  });
  return data;
}
