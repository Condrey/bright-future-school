"use server";

import prisma from "@/lib/prisma";
import { borrowerDataInclude } from "@/lib/types";

export async function getAllBorrowings() {
  const data = await prisma.borrower.findMany({
    orderBy: { borrowedAt: "desc" },
    include: borrowerDataInclude,
  });
  return data;
}

export async function getBorrowedBookAggregate() {
  const data = await prisma.individualBook.aggregate({
    _max: { borrowCount: true },
    _min: { borrowCount: true },
    _avg: { borrowCount: true },
    _sum: { borrowCount: true },
  });
  return data;
}
