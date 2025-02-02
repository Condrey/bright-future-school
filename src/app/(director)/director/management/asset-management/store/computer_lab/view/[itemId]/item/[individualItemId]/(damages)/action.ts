"use server";

import prisma from "@/lib/prisma";
import { userDataSelect } from "@/lib/types";
import { assetDamageSchema, AssetDamageSchema } from "@/lib/validation";
import { AssetCondition, AssetStatus } from "@prisma/client";

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

export async function addDamage(input: AssetDamageSchema) {
  const { condition, damageDetails, quantity, isRepaired, userId, parentId } =
    assetDamageSchema.parse(input);
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
        },
      },
    },
  });
}

export async function updateDamage(input: AssetDamageSchema) {
  const {
    condition,
    damageDetails,
    quantity,
    isRepaired,
    userId,
    id,
    parentId,
  } = assetDamageSchema.parse(input);
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
          data: { condition, damageDetails, quantity, isRepaired, userId },
        },
      },
    },
  });
}

export async function repairUnrepairDamage(input: AssetDamageSchema) {
  const { isRepaired, id, parentId } = assetDamageSchema.parse(input);
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
}

export async function deleteDamage(id: string) {
  const data = await prisma.assetDamage.delete({
    where: { id },
  });
  return data.id;
}
