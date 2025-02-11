"use server";

import prisma from "@/lib/prisma";
import { userDataSelect } from "@/lib/types";
import { assetDamageSchema, AssetDamageSchema } from "@/lib/validation";
import {
  AssetCategory,
  AssetCondition,
  AssetStatus,
  BookStatus,
} from "@prisma/client";

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
              userId,
              repairPrice,
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
              userId,
              repairPrice,
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
              userId,
              repairPrice,
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
              userId,
              repairPrice,
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
              userId,
              repairPrice,
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
      await prisma.individualBook.update({
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
                isSchoolCost,
                damageDetails,
                quantity,
                isRepaired,
                userId,
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
                isSchoolCost,
                damageDetails,
                quantity,
                isRepaired,
                userId,
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
                isSchoolCost,
                quantity,
                isRepaired,
                userId,
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
                isSchoolCost,
                quantity,
                isRepaired,
                userId,
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
                isSchoolCost,
                damageDetails,
                quantity,
                isRepaired,
                userId,
              },
            },
          },
        },
      });
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
