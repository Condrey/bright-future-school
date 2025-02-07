import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import prisma from "@/lib/prisma";
import AssetPayments from "./asset-payments";
import StudentsPerLevel from "./students-per-level";

export default async function Charts() {
  const [studentsPerLevel, assetPayments] = await Promise.all([
    await prisma.academicYear.findMany({
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
    }),
    await prisma.assetDamage.findMany({
      select: {
        repairPrice: true,
        isSchoolCost: true,
        repairBalance: true,
      },
    }),
  ]);
  return (
    <div className="flex flex-wrap justify-between gap-3">
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
      <AssetPayments assetDamages={assetPayments} />
    </div>
  );
}

export function ChartsFallback() {
  return (
    <div className="flex gap-3 justify-between flex-wrap">
      {Array.from({ length: 2 }, (_, index) => (
        <Card key={index} className="w-fit animate-pulse">
          <CardHeader className="items-center">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-28" />
          </CardHeader>
          <CardContent className="flex-1">
            <Skeleton className="mx-auto size-44  rounded-full" />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Skeleton className="h-3 w-56" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
