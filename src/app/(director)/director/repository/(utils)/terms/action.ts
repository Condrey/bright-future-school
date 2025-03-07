"use server";

import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { termSchema, TermSchema } from "@/lib/validation";

export async function getTermsAction() {
  const terms = await prisma.term.findMany({
    orderBy: { term: "asc" },
  });
  return terms;
}
export async function addTermAction(input: TermSchema) {
  const { term } = termSchema.parse(input);
  const timeInMills = Date.now().toString();

  const data = await prisma.$transaction(async (tx) => {
    let slug = slugify(term);

    const hasSlug = await tx.term.findFirst({ where: { slug } });
    if (hasSlug) {
      slug = slug + timeInMills.substring(timeInMills.length - 3);
    }
    const data = await tx.term.create({
      data: {
        term,
        slug,
      },
    });
    return data;
  });
  return data;
}

export async function editTermAction(input: TermSchema) {
  const { term, id } = termSchema.parse(input);

  const timeInMills = Date.now().toString();

  const data = await prisma.$transaction(async (tx) => {
    let slug = slugify(term);

    const hasSlug = await tx.term.findFirst({ where: { slug } });
    if (hasSlug) {
      slug = slug + timeInMills.substring(timeInMills.length - 3);
    }
    const data = await tx.term.update({
      where: { id },

      data: {
        term,
        slug,
      },
    });
    return data;
  });
  return data;
}

export async function deleteTermAction(id: string) {
  const data = await prisma.term.delete({ where: { id } });
  return data.id;
}
