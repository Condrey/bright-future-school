"use server";

import { validateRequest } from "@/auth";
import { myPrivileges } from "@/lib/enums";
import prisma from "@/lib/prisma";
import { userDataSelect } from "@/lib/types";
import {
  assetDamageSchema,
  AssetDamageSchema,
  assetRepairPaymentSchema,
  AssetRepairPaymentSchema,
} from "@/lib/validation";
import {
  AssetCategory,
  AssetCondition,
  AssetStatus,
  BookStatus,
  Role,
} from "@prisma/client";

export async function upsertAssetRepairPayment({
  input,
}: {
  input: AssetRepairPaymentSchema;
}) {
  const { user } = await validateRequest();
  if (!user) throw Error("Unauthorized");
  const canUpsertPayment = myPrivileges[user.role].includes(Role.BURSAR);
  if (!canUpsertPayment) throw Error("Unauthorized");
  const { assetDamageId, isSchoolCost, paidAmount, id } =
    assetRepairPaymentSchema.parse(input);

  await prisma.assetDamage.update({
    where: { id: assetDamageId },
    data: {
      repairBalance: { decrement: paidAmount },
      assetRepairPayments: {
        upsert: {
          where: { id },
          create: {
            paidAmount,
            isSchoolCost,
            userId: user.id,
          },
          update: {
            paidAmount,
            isSchoolCost,
            userId: user.id,
          },
        },
      },
    },
  });
}

export async function getAllPossibleAssetDamagers() {
  const currentYear = new Date().getFullYear();
  const data = await prisma.academicYear.findFirst({
    where: { year: { equals: currentYear.toString() } },
    select: {
      academicYearClasses: {
        select: {
          streams: {
            select: {
              pupils: {
                select: {
                  user: { select: userDataSelect },
                  classStream: {
                    select: {
                      class: {
                        select: {
                          academicYear: true,
                          class: {
                            select: { name: true, level: true },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  const formattedData =
    data?.academicYearClasses.flatMap((a) =>
      a.streams.flatMap((s) => s.pupils),
    ) || [];
  return formattedData;
}

export async function addDamage({
  input,
  assetCategory,
}: {
  input: AssetDamageSchema;
  assetCategory: AssetCategory;
}) {
  const {
    condition,
    damageDetails,
    quantity,
    isRepaired,
    userId,
    parentId,
    repairPrice,
    isSchoolCost,
  } = assetDamageSchema.parse(input);
  switch (assetCategory) {
    case "LIBRARY":
      await prisma.individualBook.update({
        where: { id: parentId },
        data: {
          condition,
          status:
            condition === AssetCondition.DAMAGED
              ? BookStatus.DAMAGED
              : BookStatus.AVAILABLE,
          bookDamages: {
            create: {
              condition,
              damageDetails,
              quantity,
              isRepaired,
              userId: isSchoolCost ? undefined : userId,
              repairPrice,
              repairBalance: repairPrice,
              isSchoolCost,
            },
          },
        },
      });
      break;
    case "COMPUTER_LAB":
      await prisma.individualComputerLabItem.update({
        where: { id: parentId },
        data: {
          condition,
          status:
            condition === AssetCondition.DAMAGED
              ? AssetStatus.DISPOSED
              : condition === AssetCondition.FAIR ||
                  condition === AssetCondition.POOR
                ? AssetStatus.UNDER_MAINTENANCE
                : AssetStatus.AVAILABLE,
          assetDamages: {
            create: {
              condition,
              damageDetails,
              quantity,
              isRepaired,
              userId: isSchoolCost ? undefined : userId,
              repairPrice,
              repairBalance: repairPrice,
              isSchoolCost,
            },
          },
        },
      });
      break;
    case "LABORATORY":
      await prisma.individualLabItem.update({
        where: { id: parentId },
        data: {
          condition,
          status:
            condition === AssetCondition.DAMAGED
              ? AssetStatus.UNDER_MAINTENANCE
              : AssetStatus.AVAILABLE,
          assetDamages: {
            create: {
              condition,
              damageDetails,
              quantity,
              isRepaired,
              userId: isSchoolCost ? undefined : userId,
              repairPrice,
              repairBalance: repairPrice,
              isSchoolCost,
            },
          },
        },
      });
      break;
    case "GENERAL_STORE":
      await prisma.individualGeneralStoreItem.update({
        where: { id: parentId },
        data: {
          condition,
          status:
            condition === AssetCondition.DAMAGED
              ? AssetStatus.UNDER_MAINTENANCE
              : AssetStatus.AVAILABLE,
          assetDamages: {
            create: {
              condition,
              damageDetails,
              quantity,
              isRepaired,
              userId: isSchoolCost ? undefined : userId,
              repairPrice,
              repairBalance: repairPrice,
              isSchoolCost,
            },
          },
        },
      });
      break;
    case "FOOD_STORE":
      await prisma.individualFoodStoreItem.update({
        where: { id: parentId },
        data: {
          condition,
          status:
            condition === AssetCondition.DAMAGED
              ? AssetStatus.UNDER_MAINTENANCE
              : AssetStatus.AVAILABLE,
          assetDamages: {
            create: {
              condition,
              damageDetails,
              quantity,
              isRepaired,
              userId: isSchoolCost ? undefined : userId,
              repairPrice,
              repairBalance: repairPrice,
              isSchoolCost,
            },
          },
        },
      });
      break;
  }
}

export async function updateDamage({
  input,
  assetCategory,
}: {
  input: AssetDamageSchema;
  assetCategory: AssetCategory;
}) {
  const {
    condition,
    damageDetails,
    quantity,
    isRepaired,
    userId,
    id,
    parentId,
    repairPrice,
    isSchoolCost,
  } = assetDamageSchema.parse(input);
  switch (assetCategory) {
    case "LIBRARY":
      await prisma.$transaction(
        async (tx) => {
          const previousPayments = await tx.assetRepairPayment.aggregate({
            _sum: { paidAmount: true },
          });
          await tx.individualBook.update({
            where: { id: parentId },
            data: {
              condition,
              status:
                condition === AssetCondition.DAMAGED
                  ? BookStatus.DAMAGED
                  : BookStatus.AVAILABLE,
              bookDamages: {
                update: {
                  where: { id },
                  data: {
                    condition,
                    repairPrice,
                    repairBalance:
                      (repairPrice || 0) -
                      (previousPayments._sum.paidAmount ?? 0),
                    isSchoolCost,
                    damageDetails,
                    quantity,
                    isRepaired,
                    userId: isSchoolCost ? undefined : userId,
                  },
                },
              },
            },
          });
        },
        {
          timeout: 60000,
          maxWait: 60000,
        },
      );
      break;
    case "COMPUTER_LAB":
      await prisma.$transaction(
        async (tx) => {
          const previousPayments = await tx.assetRepairPayment.aggregate({
            _sum: { paidAmount: true },
          });
          await tx.individualComputerLabItem.update({
            where: { id: parentId },
            data: {
              condition,
              status:
                condition === AssetCondition.DAMAGED
                  ? AssetStatus.DISPOSED
                  : condition === AssetCondition.FAIR ||
                      condition === AssetCondition.POOR
                    ? AssetStatus.UNDER_MAINTENANCE
                    : AssetStatus.AVAILABLE,
              assetDamages: {
                update: {
                  where: { id },
                  data: {
                    condition,
                    repairPrice,
                    repairBalance:
                      (repairPrice || 0) -
                      (previousPayments._sum.paidAmount ?? 0),
                    isSchoolCost,
                    damageDetails,
                    quantity,
                    isRepaired,
                    userId: isSchoolCost ? undefined : userId,
                  },
                },
              },
            },
          });
        },
        {
          timeout: 60000,
          maxWait: 60000,
        },
      );

      break;
    case "LABORATORY":
      await prisma.$transaction(
        async (tx) => {
          const previousPayments = await tx.assetRepairPayment.aggregate({
            _sum: { paidAmount: true },
          });
          await tx.individualLabItem.update({
            where: { id: parentId },
            data: {
              condition,
              status:
                condition === AssetCondition.DAMAGED
                  ? AssetStatus.UNDER_MAINTENANCE
                  : AssetStatus.AVAILABLE,
              assetDamages: {
                update: {
                  where: { id },
                  data: {
                    condition,
                    damageDetails,
                    repairPrice,
                    repairBalance:
                      (repairPrice || 0) -
                      (previousPayments._sum.paidAmount ?? 0),
                    isSchoolCost,
                    quantity,
                    isRepaired,
                    userId: isSchoolCost ? undefined : userId,
                  },
                },
              },
            },
          });
        },
        {
          timeout: 60000,
          maxWait: 60000,
        },
      );

      break;
    case "GENERAL_STORE":
      await prisma.$transaction(
        async (tx) => {
          const previousPayments = await tx.assetRepairPayment.aggregate({
            _sum: { paidAmount: true },
          });
          await tx.individualGeneralStoreItem.update({
            where: { id: parentId },
            data: {
              condition,
              status:
                condition === AssetCondition.DAMAGED
                  ? AssetStatus.UNDER_MAINTENANCE
                  : AssetStatus.AVAILABLE,
              assetDamages: {
                update: {
                  where: { id },
                  data: {
                    condition,
                    damageDetails,
                    repairPrice,
                    repairBalance:
                      (repairPrice || 0) -
                      (previousPayments._sum.paidAmount ?? 0),
                    isSchoolCost,
                    quantity,
                    isRepaired,
                    userId: isSchoolCost ? undefined : userId,
                  },
                },
              },
            },
          });
        },
        {
          timeout: 60000,
          maxWait: 60000,
        },
      );

      break;
    case "FOOD_STORE":
      await prisma.$transaction(
        async (tx) => {
          const previousPayments = await tx.assetRepairPayment.aggregate({
            _sum: { paidAmount: true },
          });
          await tx.individualFoodStoreItem.update({
            where: { id: parentId },
            data: {
              condition,
              status:
                condition === AssetCondition.DAMAGED
                  ? AssetStatus.UNDER_MAINTENANCE
                  : AssetStatus.AVAILABLE,
              assetDamages: {
                update: {
                  where: { id },
                  data: {
                    condition,
                    repairPrice,
                    repairBalance:
                      (repairPrice || 0) -
                      (previousPayments._sum.paidAmount ?? 0),
                    isSchoolCost,
                    damageDetails,
                    quantity,
                    isRepaired,
                    userId: isSchoolCost ? undefined : userId,
                  },
                },
              },
            },
          });
        },
        {
          timeout: 60000,
          maxWait: 60000,
        },
      );

      break;
  }
}

export async function repairUnrepairDamage({
  input,
  assetCategory,
}: {
  input: AssetDamageSchema;
  assetCategory: AssetCategory;
}) {
  const { isRepaired, id, parentId } = assetDamageSchema.parse(input);
  switch (assetCategory) {
    case "LIBRARY":
      await prisma.individualBook.update({
        where: { id: parentId },
        data: {
          condition: isRepaired ? AssetCondition.GOOD : AssetCondition.DAMAGED,
          status: !isRepaired ? BookStatus.DAMAGED : BookStatus.AVAILABLE,
          bookDamages: {
            update: {
              where: { id },
              data: {
                isRepaired,
                condition: isRepaired
                  ? AssetCondition.GOOD
                  : AssetCondition.DAMAGED,

                repairedAt: new Date(),
              },
            },
          },
        },
      });
      break;
    case "COMPUTER_LAB":
      await prisma.individualComputerLabItem.update({
        where: { id: parentId },
        data: {
          condition: isRepaired ? AssetCondition.GOOD : AssetCondition.DAMAGED,
          status: !isRepaired
            ? AssetStatus.UNDER_MAINTENANCE
            : AssetStatus.AVAILABLE,
          assetDamages: {
            update: {
              where: { id },
              data: {
                isRepaired,
                condition: isRepaired
                  ? AssetCondition.GOOD
                  : AssetCondition.DAMAGED,

                repairedAt: new Date(),
              },
            },
          },
        },
      });
      break;
    case "LABORATORY":
      await prisma.individualLabItem.update({
        where: { id: parentId },
        data: {
          condition: isRepaired ? AssetCondition.GOOD : AssetCondition.DAMAGED,
          status: !isRepaired
            ? AssetStatus.UNDER_MAINTENANCE
            : AssetStatus.AVAILABLE,
          assetDamages: {
            update: {
              where: { id },
              data: {
                isRepaired,
                condition: isRepaired
                  ? AssetCondition.GOOD
                  : AssetCondition.DAMAGED,

                repairedAt: new Date(),
              },
            },
          },
        },
      });
      break;
    case "GENERAL_STORE":
      await prisma.individualGeneralStoreItem.update({
        where: { id: parentId },
        data: {
          condition: isRepaired ? AssetCondition.GOOD : AssetCondition.DAMAGED,
          status: !isRepaired
            ? AssetStatus.UNDER_MAINTENANCE
            : AssetStatus.AVAILABLE,
          assetDamages: {
            update: {
              where: { id },
              data: {
                isRepaired,
                condition: isRepaired
                  ? AssetCondition.GOOD
                  : AssetCondition.DAMAGED,

                repairedAt: new Date(),
              },
            },
          },
        },
      });
      break;
    case "FOOD_STORE":
      await prisma.individualFoodStoreItem.update({
        where: { id: parentId },
        data: {
          condition: isRepaired ? AssetCondition.GOOD : AssetCondition.DAMAGED,
          status: !isRepaired
            ? AssetStatus.UNDER_MAINTENANCE
            : AssetStatus.AVAILABLE,
          assetDamages: {
            update: {
              where: { id },
              data: {
                isRepaired,
                condition: isRepaired
                  ? AssetCondition.GOOD
                  : AssetCondition.DAMAGED,

                repairedAt: new Date(),
              },
            },
          },
        },
      });
      break;
  }
}

export async function deleteDamage(id: string) {
  const data = await prisma.assetDamage.delete({
    where: { id },
  });
  return data.id;
}
