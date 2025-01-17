"use server";

import prisma from "@/lib/prisma";
import { yearSchema, YearSchema } from "@/lib/validation";

export async function getYearsAction() {
  const years = await prisma.academicYear.findMany({
    orderBy: { year: "asc" },
  });
  return years;
}

export async function addYearAction(input: YearSchema) {
  const { year, startAt, endAt } = yearSchema.parse(input);

  const data = await prisma.$transaction(
    async (tx) => {
      const classes = await tx.class.findMany({ select: { id: true } });
      const terms = await tx.term.findMany({ select: { id: true } });
      const streams = await tx.stream.findMany({ select: { id: true } });
      const academicYear = await tx.academicYear.create({
        data: {
          year,
          startAt,
          endAt,
        },
      });

      if (!!classes.length) {
        await tx.academicYearClass.createMany({
          data: classes.map((c) => ({
            classId: c.id,
            academicYearId: academicYear.id,
          })),
          skipDuplicates: true,
        });
      }

      const academicYearClasses = await tx.academicYearClass.findMany({
        select: { id: true },
      });

      for (const a of academicYearClasses) {
        if (!!terms.length) {
          await tx.classTerm.createMany({
            data: terms.map((t) => ({
              classId: a.id,
              termId: t.id,
              endAt: new Date(),
            })),
            skipDuplicates: true,
          });
        }
        if (!!streams.length) {
          await tx.classStream.createMany({
            data: streams.map((s) => ({
              classId: a.id,
              streamId: s.id,
            })),
            skipDuplicates: true,
          });
        }
      }

      return academicYear;
    },
    { timeout: 60 * 1000, maxWait: 60 * 1000 },
  );
  return data;
}

export async function editYearAction(input: YearSchema) {
  const { year, id, startAt, endAt } = yearSchema.parse(input);
  const data = await prisma.$transaction(
    async (tx) => {
      const classes = await tx.class.findMany({ select: { id: true } });
      const terms = await tx.term.findMany({ select: { id: true } });
      const streams = await tx.stream.findMany({ select: { id: true } });
      const updatedYear = await tx.academicYear.update({
        where: { id },
        data: {
          year,
          startAt,
          endAt,
        },
      });

      if (!!classes.length) {
        await tx.academicYearClass.createMany({
          data: classes.map((c) => ({
            classId: c.id,
            academicYearId: updatedYear.id,
          })),
          skipDuplicates: true,
        });
      }

      const academicYearClasses = await tx.academicYearClass.findMany({
        where: { academicYearId: updatedYear.id },
        select: { id: true },
      });

      for (const a of academicYearClasses) {
        if (!!terms.length) {
          await tx.classTerm.createMany({
            data: terms.map((t) => ({
              classId: a.id,
              termId: t.id,
              endAt: new Date(),
            })),
            skipDuplicates: true,
          });
        }

        if (!!streams.length) {
          await tx.classStream.createMany({
            data: streams.map((s) => ({
              classId: a.id,
              streamId: s.id,
            })),
            skipDuplicates: true,
          });
        }
      }

      return updatedYear;
    },
    {
      timeout: 60 * 1000,
      maxWait: 60 * 1000,
    },
  );
  return data;
}

export async function deleteYearAction(id: string) {
  const data = await prisma.academicYear.delete({ where: { id } });
  return data.id;
}
