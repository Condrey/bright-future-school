import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { yearSchema } from "@/lib/validation";
import { z } from "zod";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user } = await validateRequest();
    if (!user) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 404, statusText: "Unauthorized." },
      );
    }
    const parsedBody = {
      ...body,
      startAt: new Date(body.startAt),
      endAt: new Date(body.endAt),
    };
    const { year, startAt, endAt } = yearSchema.parse(parsedBody);
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
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Internal server error." },
      { status: 500, statusText: "Internal server error." },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { user } = await validateRequest();

    if (!user) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 404, statusText: "Unauthorized." },
      );
    }
    const parsedBody = {
      ...body,
      startAt: new Date(body.startAt),
      endAt: new Date(body.endAt),
    };

    const { year, id, startAt, endAt } = yearSchema.parse(parsedBody);

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
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Internal server error." },
      { status: 500, statusText: "Internal server error." },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { user } = await validateRequest();

    if (!user) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 404, statusText: "Unauthorized." },
      );
    }
    const schema = z.object({
      id: z.string(),
    });
    const { id } = schema.parse(body);

    const data = await prisma.academicYear.delete({ where: { id } });
    return Response.json(data.id);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Internal server error." },
      { status: 500, statusText: "Internal server error." },
    );
  }
}