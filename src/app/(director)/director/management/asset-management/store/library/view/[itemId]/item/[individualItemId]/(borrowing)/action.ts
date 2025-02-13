"use server";

import { getAllPossibleAssetDamagers } from "@/components/damages/action";
import prisma from "@/lib/prisma";
import { userDataSelect } from "@/lib/types";
import { borrowerSchema, BorrowerSchema } from "@/lib/validation";
import { BookStatus, BorrowStatus } from "@prisma/client";

export async function getPotentialBorrowers() {
  const [pupils, staffs] = await Promise.all([
    getAllPossibleAssetDamagers(),
    prisma.staff.findMany({ include: { user: { select: userDataSelect } } }),
  ]);
  return { pupils, staffs };
}

export async function retrieveBook({
  individualBookId,
  borrowerId,
}: {
  individualBookId: string;
  borrowerId: string;
}) {
  const currentTime = new Date();
  await prisma.individualBook.update({
    where: { id: individualBookId },
    data: {
      status: BookStatus.AVAILABLE,
      borrowers: {
        update: {
          where: { id: borrowerId },
          data: { returnAt: currentTime, status: BorrowStatus.RETURNED },
        },
      },
    },
  });
}

export async function lendBook({ input }: { input: BorrowerSchema }) {
  const { borrowedAt, individualBookId, status, userId, id, returnAt } =
    borrowerSchema.parse(input);
  const currentTime = new Date();
  await prisma.individualBook.update({
    where: { id: individualBookId },
    data: {
      status: BookStatus.BORROWED,
      borrowers: {
        upsert: {
          where: { id },
          create: {
            borrowedAt: currentTime,
            status,
            userId,
          },
          update: { borrowedAt: currentTime, status, userId },
        },
      },
    },
  });
}
