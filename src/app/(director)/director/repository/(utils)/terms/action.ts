"use server";

import prisma from "@/lib/prisma";
import { termSchema, TermSchema } from "@/lib/validation";

export async function getTermsAction() {
  const terms = await prisma.term.findMany({
    orderBy: { term: "asc" },
  });
  return terms;
}
export async function addTermAction(input: TermSchema) {
  const { term } = termSchema.parse(input);

  const data = await prisma.term.create({
    data: {
      term,
    },
  });
  return data;
}

export async function editTermAction(input: TermSchema) {
  const { term, id } = termSchema.parse(input);
  const data = await prisma.term.update({
    where: { id },
    data: {
      term,
    },
  });
  return data;
}

export async function deleteTermAction(id: string) {
  const data = await prisma.term.delete({ where: { id } });
  return data.id;
}
