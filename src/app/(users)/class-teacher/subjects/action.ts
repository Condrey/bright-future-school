"use server";

import { validateRequest } from "@/auth";
import { myPrivileges } from "@/lib/enums";
import prisma from "@/lib/prisma";
import { ClassStreamData, classStreamDataInclude } from "@/lib/types";
import { Role } from "@prisma/client";
import { unauthorized } from "next/navigation";
import { cache } from "react";

async function classStreams(): Promise<ClassStreamData[]> {
  const { user: currentUser } = await validateRequest();
  if (!currentUser) return unauthorized();
  const isAuthorized = myPrivileges[currentUser.role].includes(
    Role.CLASS_TEACHER,
  );
  if (!isAuthorized) return unauthorized();
  if (
    currentUser.role === Role.DIRECTOR ||
    currentUser.role === Role.SUPER_ADMIN
  ) {
    const data = await prisma.classStream.findMany({
      include: classStreamDataInclude,
      orderBy: [
        { class: { academicYear: { year: "desc" } } },
        { class: { class: { id: "asc" } } },
      ],
    });
    return data;
  } else {
    const data = await prisma.staff.findUnique({
      where: { id: currentUser.id },
      include: {
        classStreams: {
          include: classStreamDataInclude,
          orderBy: [
            { class: { academicYear: { year: "desc" } } },
            { class: { class: { id: "asc" } } },
          ],
        },
      },
    });
    return data?.classStreams!;
  }
}
export const getClassTeacherClassStreams = cache(classStreams);
