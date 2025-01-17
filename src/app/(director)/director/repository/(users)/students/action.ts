"use server";

import prisma from "@/lib/prisma";
import { ClassStreamData, classStreamDataInclude } from "@/lib/types";

export async function fetchYearClassStreams(
  searchParamYear: string | undefined,
) {
  const data = await prisma.academicYear.findMany({
    where: {
      year: !searchParamYear ? {} : { equals: searchParamYear.trim() },
    },
    select: {
      academicYearClasses: {
        select: {
          streams: {
            include: classStreamDataInclude,
            orderBy: [
              { class: { class: { level: { name: "desc" } } } },
              { class: { class: { createdAt: "asc" } } },
              { stream: { name: "asc" } },
            ],
          },
        },
      },
    },
  });
  const classStreams: ClassStreamData[] = data.flatMap((d) =>
    d.academicYearClasses.flatMap((a) => a.streams),
  );
  return classStreams;
}
