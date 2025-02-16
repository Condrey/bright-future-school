"use server";

import prisma from "@/lib/prisma";
import { staffDataInclude } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { teachingStaffSchema, TeachingStaffSchema } from "@/lib/validation";
import { hash } from "@node-rs/argon2";
import { Role, StaffType } from "@prisma/client";

export async function getTeachingStaffsAction() {
  const teachingStaffs = await prisma.staff.findMany({
    where: { staffType: StaffType.TEACHING_STAFF },
    orderBy: { user: { name: "asc" } },
    include: staffDataInclude,
  });
  return teachingStaffs;
}

export async function addTeachingStaffAction(input: TeachingStaffSchema) {
  const {
    user: { name },
  } = teachingStaffSchema.parse(input);
  const currentTimeMills = Date.now().toString();
  const password =
    name.split(" ").pop() +
    "_staff@" +
    currentTimeMills.substring(currentTimeMills.length - 3);

  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const data = await prisma.$transaction(
    async (tx) => {
      let username = slugify(name);
      const userWithUsername = await tx.user.findUnique({
        where: { username },
      });
      if (!!userWithUsername) {
        username =
          username + currentTimeMills.substring(currentTimeMills.length - 3);
      }

      const { id } = await tx.user.create({
        data: {
          name,
          username,
          passwordHash,          role:Role.STAFF
          
        },
      });
      const staff = await tx.staff.create({
        data: {
          staffType: StaffType.TEACHING_STAFF,
          genericPassword: password,
          user: {
            connectOrCreate: {
              where: { id },
              create: {
                name,
                username,
                passwordHash,
              },
            },
          },
        },
        include: staffDataInclude,
      });
      return staff;
    },
    {
      maxWait: 60000,
      timeout: 60000,
    },
  );
  return data;
}

export async function editTeachingStaffAction(input: TeachingStaffSchema) {
  const {
    user: { name, id, role, email,telephone,username, },
    id: staffId,
  } = teachingStaffSchema.parse(input);

  const data = await prisma.$transaction(
    async (tx) => {
      await tx.user.update({
        where: { id },
        data: {
          name, role, email,telephone,username,
        },
      });
      const staff = await tx.staff.findUnique({
        where: { id: staffId },
        include: staffDataInclude,
      });
      return staff;
    },
    {
      maxWait: 60000,
      timeout: 60000,
    },
  );
  return data;
}

export async function deleteTeachingStaffAction({
  userId,
}: {
  userId: string;
  staffId: string;
}) {
  const data = await prisma.user.delete({ where: { id: userId } });
  return data.id;
}
