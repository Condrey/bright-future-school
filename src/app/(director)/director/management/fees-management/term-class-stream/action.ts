"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { feesSchema, FeesSchema } from "@/lib/validation";
import { Role } from "@prisma/client";
import cuid from "cuid";

export async function addFees(input: FeesSchema) {
  const { user } = await validateRequest();

  // Critical request validation
  if (!user) throw Error("Unauthorized.");
  const acceptedRoles: Role[] = [Role.BURSAR, Role.DIRECTOR, Role.SUPER_ADMIN];
  if (!acceptedRoles.includes(user.role)) throw new Error("Unauthorized");

  const { pupilId, feesPayment, termId } = feesSchema.parse(input);
  const id = cuid();

  const data = await prisma.$transaction(
    async (tx) => {
      const classTerm = await tx.classTerm.findUnique({
        where: { id: termId },
      });
      if (!classTerm) throw Error("There is no term with this id.");
      const schoolFeesAmount = classTerm.feesAmount || 0;

      const schoolFeesPayments = await tx.fees.findMany({
        where: {
          pupilId,
          termId,
        },
        select: { feesPayments: { select: { amountPaid: true } } },
      });
      const totalAmountPaid =
        schoolFeesPayments
          .flatMap((s) => s.feesPayments.flatMap((p) => p.amountPaid))
          .reduce((total, amount) => (total || 0) + (amount || 0), 0) ||
        0 + feesPayment.amountPaid;

      const newFeesPayment = await tx.feesPayment.create({
        data: {
          amountPaid: feesPayment.amountPaid,
          fees: {
            connectOrCreate: {
              where: { id },
              create: {
                balance: schoolFeesAmount - totalAmountPaid,
                pupilId,
                termId,
              },
            },
          },
          paidBy: { connect: { id: user.id } },
        },
      });

      return null;
    },
    { maxWait: 60000, timeout: 60000 },
  );
  // Make calculations for balance
  // Create Fees in classTerm model
  // Create FeesPayment in Fees Model
}
