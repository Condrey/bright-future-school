"use server";

import prisma from "@/lib/prisma";
import { libraryBookCategoryDataInclude } from "@/lib/types";

export async function getAllBookCategories() {
  const data = await prisma.libraryBookCategory.findMany({
    orderBy: { category: "asc" },
    include: libraryBookCategoryDataInclude,
  });
  return data;
}
