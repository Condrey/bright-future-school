"use server";
import prisma from "@/lib/prisma";
import { cache } from "react";

export const getCachedChartData = cache(getChartData);
export async function getStudentsPerLevel() {
  const data = await prisma.academicYear.findMany({
    where: { year: `${new Date().getFullYear()}` },
    select: {
      academicYearClasses: {
        select: {
          streams: {
            select: {
              _count: { select: { pupils: true } },
              class: {
                select: {
                  class: { select: { level: { select: { name: true } } } },
                },
              },
            },
          },
        },
      },
    },
  });
  return data.flatMap((d) =>
    d.academicYearClasses.flatMap((a) =>
      a.streams.flatMap((s) => ({
        count: s._count.pupils,
        level: s.class?.class?.level?.name!,
      })),
    ),
  );
}
export async function getAssetPayments() {
  return prisma.assetDamage.findMany({
    select: {
      repairPrice: true,
      isSchoolCost: true,
      repairBalance: true,
    },
  });
}
export async function getChartData() {
  const [studentsPerLevel, assetPayments] = await Promise.all([
    await getStudentsPerLevel(),
    await getAssetPayments(),
  ]);
  return { studentsPerLevel, assetPayments };
}
