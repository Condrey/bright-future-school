"use server";

import prisma from "@/lib/prisma";
import { staffDataInclude } from "@/lib/types";
import { slugify } from "@/lib/utils";
import {
  nonTeachingStaffSchema,
  NonTeachingStaffSchema,
} from "@/lib/validation";
import { hash } from "@node-rs/argon2";
import { Role, StaffType } from "@prisma/client";

export async function getNonTeachingStaffsAction() {
  const nonTeachingStaffs = await prisma.staff.findMany({
    where: { staffType: StaffType.NON_TEACHING_STAFF },
    orderBy: { user: { name: "asc" } },
    include: staffDataInclude,
  });
  return nonTeachingStaffs;
}

export async function addNonTeachingStaffAction(input: NonTeachingStaffSchema) {
  const {
    user: { name },
  } = nonTeachingStaffSchema.parse(input);
  const currentTimeMills = Date.now().toString();
  const password =
    name.split(" ").pop() +
    "_nts@" +
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
          passwordHash,
          role: Role.STAFF,
        },
      });
      const staff = await tx.staff.create({
        data: {
          staffType: StaffType.NON_TEACHING_STAFF,
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

export async function editNonTeachingStaffAction(
  input: NonTeachingStaffSchema,
) {
  const {
    user: { name, id, role, email, telephone, username },
    id: staffId,
  } = nonTeachingStaffSchema.parse(input);

  const data = await prisma.$transaction(
    async (tx) => {
      await tx.user.update({
        where: { id },
        data: {
          name,
          role,
          email: email || null,
          telephone,
          username,
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

export async function deleteNonTeachingStaffAction({
  userId,
}: {
  userId: string;
  staffId: string;
}) {
  const data = await prisma.user.delete({ where: { id: userId } });
  return data.id;
}
