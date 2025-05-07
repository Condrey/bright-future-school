"use server";

import { validateRequest } from "@/auth";
import { myPrivileges } from "@/lib/enums";
import prisma from "@/lib/prisma";
import { classStreamDataInclude } from "@/lib/types";
import { Role } from "@prisma/client";
import { unauthorized } from "next/navigation";
import { cache } from "react";

async function classStreamById(id: string) {
  const { user: currentUser } = await validateRequest();
  if (!currentUser) return unauthorized();
  const isAuthorized = myPrivileges[currentUser.role].includes(
    Role.CLASS_TEACHER,
  );
  if (!isAuthorized) return unauthorized();
  const data = await prisma.classStream.findUnique({
    where: { id },
    include: classStreamDataInclude,
  });
  return data;
}
export const getClassStreamById = cache(classStreamById);
