"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { pupilDataInclude } from "@/lib/types";
import { notFound, unauthorized } from "next/navigation";

export async function getUser() {
  const { user: validatedUser } = await validateRequest();
  if (!validatedUser) return unauthorized();
  const user = await prisma.pupil.findFirst({
    // where:{
    //   userId:validatedUser.id
    // },
    include: pupilDataInclude(),
  });
  if (!user) return notFound();
  return user;
}
