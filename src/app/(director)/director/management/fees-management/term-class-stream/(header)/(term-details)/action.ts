"use server";

import prisma from "@/lib/prisma";
import { classTermDataSelect, TermWithYearData } from "@/lib/types";
import { classTermSchema, ClassTermSchema } from "@/lib/validation";

export async function updateSingleClassTerm(input: ClassTermSchema) {
  const { id, endAt, feesAmount, startAt } = classTermSchema.parse(input);
  const data: TermWithYearData = await prisma.classTerm.update({
    where: { id },
    data: { endAt, feesAmount, startAt },
    select: classTermDataSelect(id),
  });
  return data;
}

export async function updateMultipleClassTerms({
  input,
  academicYearClassId,
}: {
  input: ClassTermSchema;
  academicYearClassId: string;
}) {
  const { endAt, feesAmount, startAt } = classTermSchema.parse(input);
  await prisma.$transaction(
    async (tx) => {
      const data = await tx.academicYearClass.findMany({
        where: { id: academicYearClassId },
        select: { streams: { select: { terms: { select: { id: true } } } } },
      });
      // Get all the term ids
      const classTermIds = data.flatMap((d) =>
        d.streams.flatMap((s) => s.terms.flatMap((t) => t.id)),
      );
      // Update all the terms having those ids
      await tx.classTerm.updateMany({
        where: { id: { in: classTermIds } },
        data: { endAt, feesAmount, startAt },
      });
    },
    {
      maxWait: 60000,
      timeout: 60000,
    },
  );
}

export async function updateAnnualClassTerms({
  input,
  levelId,
  termId,
  academicYear,
}: {
  input: ClassTermSchema;
  levelId: string;
  termId: string;
  academicYear: string;
}) {
  const { endAt, feesAmount, startAt } = classTermSchema.parse(input);

  await prisma.$transaction(
    async (tx) => {
      const data = await tx.academicYear.findMany({
        where: { year: academicYear },
        select: {
          academicYearClasses: {
            select: {
              streams: {
                select: {
                  terms: {
                    where: {
                      termId,
                    },
                    select: { id: true },
                  },
                },
              },
            },
          },
        },
      });
      const data2 = await tx.level.findUnique({
        where: { id: levelId },
        select: {
          classes: {
            select: {
              academicYearClasses: {
                select: {
                  academicYear: { select: { year: true } },
                  streams: {
                    select: {
                      terms: {
                        where: { termId },
                        select: { id: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      // Get all the term ids
      const classTermIds2 = data2?.classes
        .flatMap((c) =>
          c.academicYearClasses.flatMap((a) =>
            a.academicYear?.year !== academicYear
              ? []
              : a.streams.flatMap((s) => s.terms.flatMap((t) => t.id)),
          ),
        )
        .filter(Boolean) as string[];
      const classTermIds = data.flatMap((d) =>
        d.academicYearClasses.flatMap((a) =>
          a.streams.flatMap((s) => s.terms.flatMap((t) => t.id)),
        ),
      );
      // Update all the terms having those ids
      await tx.classTerm.updateMany({
        where: { id: { in: classTermIds2 } },
        data: { endAt, feesAmount, startAt },
      });
    },
    {
      maxWait: 60000,
      timeout: 60000,
    },
  );
}
