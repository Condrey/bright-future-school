import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { streamSchema } from "@/lib/validation";
import z from "zod";

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
    const { name } = streamSchema.parse(body);
 const data = await prisma.$transaction(
   async (tx) => {
    const data = await tx
    .stream.create({
      data: {
        name,
      },
    });
     //  get all the academic years
     const academicYears = await tx.academicYear.findMany({
       select: { id: true },
     });
     //if we have years, do the following else just return data
     if (!!academicYears.length) {
       // get all classes
       const classes = await tx.class.findMany({
         select: { id: true },
       });
       // if we have classes, do the following
       // .create Academic year classes
       // .Create class terms if term exists
       // .create class streams if streams exist
       //  else return
       if (!!classes.length) {
         for (const year of academicYears) {
           await tx.academicYearClass.createMany({
             data: classes.map((c) => ({
               classId: c.id,
               academicYearId: year.id,
             })),
             skipDuplicates: true,
           });
         }
         // Get all
         // .academic year classes
         // .terms
         // .streams
         const academicYearClasses = await tx.academicYearClass.findMany({
           select: { id: true },
         });
         const terms = await tx.term.findMany({ select: { id: true } });
         const streams = await tx.stream.findMany({ select: { id: true } });

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
       }
     }
     return data;
   },
   { maxWait: 60000, timeout: 60000 },
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
    const { name, id } = streamSchema.parse(body);
    const data = await prisma.stream.update({
      where: { id },
      data: {
        name,
      },
    });
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
    const data = await prisma.stream.delete({ where: { id } });
    return Response.json(data.id);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Internal server error." },
      { status: 500, statusText: "Internal server error." },
    );
  }
}