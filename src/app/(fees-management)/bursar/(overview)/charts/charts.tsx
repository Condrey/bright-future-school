import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import prisma from "@/lib/prisma";
import StudentsPerLevel from "./students-per-level";

export default async function Charts() {
  const studentsPerLevel = await prisma.academicYear.findMany({
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
  return (
    <div>
      <StudentsPerLevel
        data={studentsPerLevel.flatMap((d) =>
          d.academicYearClasses.flatMap((a) =>
            a.streams.flatMap((s) => ({
              count: s._count.pupils,
              level: s.class?.class?.level?.name!,
            })),
          ),
        )}
      />
    </div>
  );
}

export function ChartsFallback() {
  return (
    <Card>
      <CardContent>
        <Skeleton className="h-40 w-52" />
      </CardContent>
    </Card>
  );
}
