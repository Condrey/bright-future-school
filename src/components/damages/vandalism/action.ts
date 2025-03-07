"use server";

import prisma from "@/lib/prisma";
import { assetDamageDataInclude, VandalismDamages } from "@/lib/types";
import { AssetCategory } from "@prisma/client";

export async function fetchDamagedAssetItems(assetCategory: AssetCategory) {
  let result: VandalismDamages;
  switch (assetCategory) {
    case "LIBRARY":
      result = (
        await prisma.individualBook.findMany({
          select: {
            bookDamages: { include: assetDamageDataInclude },
            libraryBook: { select: { title: true, author: true } },
            isbn: true,
            id: true,
          },
        })
      ).flatMap(
        ({ bookDamages, libraryBook: { author, title }, isbn, id }) => ({
          damages: bookDamages,
          item: { title, description: author, uniqueIdentifier: isbn, id },
        }),
      );
      break;
    case "COMPUTER_LAB":
      result = (
        await prisma.individualComputerLabItem.findMany({
          select: {
            assetDamages: { include: assetDamageDataInclude },
            computerLabItem: { select: { name: true, model: true } },
            uniqueIdentifier: true,
            id: true,
          },
        })
      ).flatMap(
        ({
          assetDamages,
          computerLabItem: { name, model },
          uniqueIdentifier,
          id,
        }) => ({
          damages: assetDamages,
          item: { title: name, description: model, uniqueIdentifier, id },
        }),
      );
      break;
    case "LABORATORY":
      result = (
        await prisma.individualLabItem.findMany({
          select: {
            assetDamages: { include: assetDamageDataInclude },
            labItem: { select: { name: true } },
            uniqueIdentifier: true,
            id: true,
          },
        })
      ).flatMap(
        ({ assetDamages, labItem: { name }, uniqueIdentifier, id }) => ({
          damages: assetDamages,
          item: { title: name, uniqueIdentifier, id },
        }),
      );
      break;
    case "GENERAL_STORE":
      result = (
        await prisma.individualGeneralStoreItem.findMany({
          select: {
            assetDamages: { include: assetDamageDataInclude },
            generalStoreItem: {
              select: { name: true, asset: { select: { name: true } } },
            },
            uniqueIdentifier: true,
            id: true,
          },
        })
      ).flatMap(
        ({
          assetDamages,
          generalStoreItem: { name, asset },
          uniqueIdentifier,
          id,
        }) => ({
          damages: assetDamages,
          item: { title: name, description: asset.name, uniqueIdentifier, id },
        }),
      );
      break;
    case "FOOD_STORE":
      result = (
        await prisma.individualFoodStoreItem.findMany({
          select: {
            assetDamages: { include: assetDamageDataInclude },
            foodStoreItem: { select: { foodName: true, isConsumable: true } },
            uniqueIdentifier: true,
            id: true,
          },
        })
      ).flatMap(
        ({
          assetDamages,
          foodStoreItem: { foodName, isConsumable },
          uniqueIdentifier,
          id,
        }) => ({
          damages: assetDamages,
          item: {
            title: foodName,
            description: isConsumable ? "Consumable" : "Not consumable",
            uniqueIdentifier,
            id,
          },
        }),
      );
      break;
  }
  return result;
}
