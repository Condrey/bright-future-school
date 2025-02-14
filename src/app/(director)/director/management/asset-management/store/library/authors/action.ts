"use server";

import prisma from "@/lib/prisma";

export async function getAllBookAuthors() {
  const data = await prisma.libraryBook.findMany({
    distinct: "author",
    select: { author: true },
    orderBy: { author: "asc" },
  });
  return data;
}

export async function getAuthorSBooks({ author }: { author: string }) {
  const data = await prisma.libraryBook.findMany({
    where: { author },
  });
  return data;
}
