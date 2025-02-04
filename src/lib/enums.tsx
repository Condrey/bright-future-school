import {
  AssetCategory,
  AssetCondition,
  AssetItemStatus,
  AssetStatus,
  AssetUnit,
  BookStatus,
} from "@prisma/client";
import {
  ComputerIcon,
  ForkKnifeIcon,
  LibraryIcon,
  LucideIcon,
  StoreIcon,
  TestTubeIcon,
} from "lucide-react";

export const assetCategories: Record<
  AssetCategory,
  { label: string; icon: LucideIcon; explanation: string }
> = {
  LIBRARY: {
    label: "Library asset",
    icon: LibraryIcon,
    explanation:
      "Library asset items like books, novels, text books, encyclopedia, newspapers, journals. e.t.c.",
  },
  COMPUTER_LAB: {
    label: "Computer lab asset",
    icon: ComputerIcon,
    explanation:
      "Computer items like mice, UPS, AC, Whiteboard, Projector, Keyboard, Monitors, e.t.c.",
  },
  LABORATORY: {
    label: "Laboratory asset",
    icon: TestTubeIcon,
    explanation:
      "Equipments for performing laboratory experiments. For example, in the Chemistry department, Physics department, Biology department, and many more others.",
  },
  GENERAL_STORE: {
    label: "General store asset",
    icon: StoreIcon,
    explanation:
      "Items like furniture, basketballs, footballs, buses, keys and others.",
  },
  FOOD_STORE: {
    label: "Food store asset",
    icon: ForkKnifeIcon,
    explanation:
      "Food items like maize flour, beans, cooking oil, onions, and many others.",
  },
};

export const assetUnits: Record<AssetUnit, string> = {
  KILOGRAM: "Kilogram",
  SAC: "Sac",
  LITER: "Liter",
  PIECE: "Piece",
  GRAMS: "Gram",
  PACKETS: "Packet",
  PAIR: "Pair",
  JERRICAN: "Jerrican",
  CONTAINER: "Container",
  OTHERS: "Other",
};
//pairs,packets

export const assetStatuses: Record<AssetStatus, string> = {
  AVAILABLE: "Is available",
  ASSIGNED: "Is assigned",
  UNDER_MAINTENANCE: "Under maintenance",
  DISPOSED: "Is disposed",
};

export const assetItemStatuses: Record<AssetItemStatus, string> = {
  AVAILABLE: "Available",
  IN_USE: "In use",
  EXPIRED: "Expired ",
};

export const assetConditions: Record<AssetCondition, string> = {
  NEW: "Brand new",
  GOOD: "Good quality",
  FAIR: "Fairly good",
  POOR: "Poor quality",
  DAMAGED: "Damaged item",
};

export const bookStatuses: Record<BookStatus, string> = {
  AVAILABLE: "Is available",
  DAMAGED: "Is damaged",
  BORROWED: "Is borrowed",
};
