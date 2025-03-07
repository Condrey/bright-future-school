"use server";

import prisma from "@/lib/prisma";

export async function getAllSubjects() {
  const data = await prisma.subject.findMany();
  return data;
}
