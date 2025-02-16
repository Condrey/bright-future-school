"use server";

import prisma from "@/lib/prisma";
import { PupilData, pupilDataInclude } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { pupilSchema, PupilSchema } from "@/lib/validation";
import { hash } from "@node-rs/argon2";

//   . From the previous year but same stream name.
export async function addPupilsFromPreviousYearSameStream() {}

//  . From the same class but another Stream
export async function addPupilsFromSameClassSameStream() {}

//               . New pupil from another school or unregistered pupil
export async function addUnregisteredPupil({
  input,
  classStreamId,
}: {
  input: PupilSchema;
  classStreamId: string;
}) {
  console.log("classStreamId:: ", classStreamId);
  const {
    user: { name },
  } = pupilSchema.parse(input);
  const currentTimeMills = Date.now().toString();
  const password =
    name.split(" ").pop() +
    "_learner@" +
    currentTimeMills.substring(currentTimeMills.length - 3);

  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const data: PupilData = await prisma.$transaction(
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
        },
      });
      const pupil = await tx.pupil.create({
        data: {
          classStream: {
            connect: { id: classStreamId },
          },
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
        include: pupilDataInclude(),
      });
      return pupil;
    },
    {
      maxWait: 60000,
      timeout: 60000,
    },
  );

  return data;
}
