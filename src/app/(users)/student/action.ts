"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import {
  ClassTermIIDataSelect,
  FeesDataSelect,
  PupilData,
  pupilDataInclude,
} from "@/lib/types";
import { notFound, unauthorized } from "next/navigation";

export async function getUser(): Promise<PupilData> {
  const { user: validatedUser } = await validateRequest();
  if (!validatedUser) return unauthorized();
  const user = await prisma.pupil.findFirst({
    where: {
      userId: validatedUser.id,
    },
    include: pupilDataInclude(),
  });
  if (!user) return notFound();
  const mergeTermsIntoFees = (user: PupilData): FeesDataSelect[] => {
    const classTerms: ClassTermIIDataSelect[] = user.classStreams.flatMap(
      (cs) => cs.terms,
    );
    return classTerms
      .map((classTerm) => {
        return user.fees.map((fee) => {
          const term = fee.term;
          if (term.id !== classTerm.id) {
            return {
              ...fee,
              balance: 0,
              feesPayments: [],
              term: {
                ...term,
                ...classTerm,
                feesAmount: null,
              },
            };
          }
          return fee;
        });
      })
      .flat();
  };
  return { ...user, fees: mergeTermsIntoFees(user) };
}
