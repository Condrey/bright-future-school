import {
  AssetCategory,
  AssetCondition,
  AssetItemStatus,
  AssetStatus,
  AssetUnit,
  BookStatus,
  ExamType,
  Role,
  StaffType,
} from "@prisma/client";
import {
  AnchorIcon,
  ComputerIcon,
  CrossIcon,
  ForkKnifeIcon,
  LibraryIcon,
  LucideIcon,
  PresentationIcon,
  ShieldIcon,
  StoreIcon,
  TestTubeIcon,
  UserRoundIcon,
  UserRoundPenIcon,
  WalletIcon,
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

export const staffTypes: Record<
  StaffType,
  { label: string; description: string }
> = {
  TEACHING_STAFF: {
    label: "Teaching staff",
    description:
      "These are staffs that perform staff duties inclusive of organizing and officially tutoring classes.",
  },
  NON_TEACHING_STAFF: {
    label: "Non teaching staff",
    description:
      "These are staffs that perform staff duties exclusive of organizing and officially tutoring classes.",
  },
};

export const userRoles: Record<
  Role,
  { label: string; description: string; icon: LucideIcon }
> = {
  DIRECTOR: {
    label: "School director",
    icon: AnchorIcon,
    description: "",
  },
  BURSAR: {
    label: "The bursar",
    icon: WalletIcon,
    description: "",
  },
  ASSET_CARETAKER: {
    label: "Overall asset caretaker",
    icon: CrossIcon,
    description: "",
  },
  GENERAL_STORE_ASSET_CARETAKER: {
    label: "General store asset caretaker",
    icon: StoreIcon,
    description: "",
  },
  COMPUTER_LAB_ASSET_CARETAKER: {
    label: "Computer lab asset caretaker",
    icon: ComputerIcon,
    description: "",
  },
  LABORATORY_ASSET_CARETAKER: {
    label: "Laboratory asset caretaker",
    icon: TestTubeIcon,
    description: "",
  },
  LIBRARY_ASSET_CARETAKER: {
    label: "Library asset caretaker",
    icon: LibraryIcon,
    description: "",
  },
  FOOD_STORE_ASSET_CARETAKER: {
    label: "Food store asset caretaker",
    icon: ForkKnifeIcon,
    description: "",
  },
  STAFF: {
    label: "Staff",
    icon: PresentationIcon,
    description: "",
  },
  CLASS_TEACHER: {
    label: "Class teacher",
    icon: UserRoundPenIcon,
    description: "",
  },
  USER: {
    label: "Student/ pupil",
    icon: UserRoundIcon,
    description: "",
  },
  SUPER_ADMIN: {
    label: "Root admin",
    icon: ShieldIcon,
    description: "",
  },
};

export const roleRedirectPaths: Record<Role, string> = {
  DIRECTOR: "/director",
  BURSAR: "/bursar",
  ASSET_CARETAKER: "/general-asset-manager",
  CLASS_TEACHER: "/class-teacher",
  USER: "/student",
  SUPER_ADMIN: "/root",
  GENERAL_STORE_ASSET_CARETAKER: "/general-store-asset-manager",
  COMPUTER_LAB_ASSET_CARETAKER: "/computer-lab-asset-manager",
  LABORATORY_ASSET_CARETAKER: "/laboratory-asset-manager",
  LIBRARY_ASSET_CARETAKER: "/library-asset-manager",
  FOOD_STORE_ASSET_CARETAKER: "/food-store-asset-manager",
  STAFF: "/staff",
};

const allRoles = Object.values(Role).filter((role) => role != Role.USER);
export const myPrivileges: Record<Role, Role[]> = {
  SUPER_ADMIN: allRoles,

  DIRECTOR: allRoles.filter((role) => role !== Role.SUPER_ADMIN),

  BURSAR: Object.values(Role).filter(
    (role) =>
      !([Role.SUPER_ADMIN, Role.DIRECTOR, Role.USER] as Role[]).includes(role),
  ),

  ASSET_CARETAKER: [
    Role.ASSET_CARETAKER,
    Role.GENERAL_STORE_ASSET_CARETAKER,
    Role.COMPUTER_LAB_ASSET_CARETAKER,
    Role.LABORATORY_ASSET_CARETAKER,
    Role.LIBRARY_ASSET_CARETAKER,
    Role.FOOD_STORE_ASSET_CARETAKER,
    Role.STAFF,
  ],

  GENERAL_STORE_ASSET_CARETAKER: [
    Role.GENERAL_STORE_ASSET_CARETAKER,
    Role.STAFF,
  ],
  COMPUTER_LAB_ASSET_CARETAKER: [Role.COMPUTER_LAB_ASSET_CARETAKER, Role.STAFF],
  LABORATORY_ASSET_CARETAKER: [Role.LABORATORY_ASSET_CARETAKER, Role.STAFF],
  LIBRARY_ASSET_CARETAKER: [Role.LIBRARY_ASSET_CARETAKER, Role.STAFF],
  FOOD_STORE_ASSET_CARETAKER: [Role.FOOD_STORE_ASSET_CARETAKER, Role.STAFF],

  CLASS_TEACHER: [Role.CLASS_TEACHER, Role.STAFF],
  STAFF: [Role.STAFF],
  USER: [Role.USER],
};

export const allTeachingStaffCategories = allRoles.filter(
  (r) =>
    !(
      [Role.USER, Role.STAFF, Role.SUPER_ADMIN, Role.CLASS_TEACHER] as Role[]
    ).includes(r),
);

export const teachingStaffCategories = [
  Role.DIRECTOR,
  Role.BURSAR,
  Role.CLASS_TEACHER,
];
export const assetCaretakerCategories = [
  Role.ASSET_CARETAKER,
  Role.LIBRARY_ASSET_CARETAKER,
  Role.FOOD_STORE_ASSET_CARETAKER,
  Role.LABORATORY_ASSET_CARETAKER,
  Role.COMPUTER_LAB_ASSET_CARETAKER,
  Role.GENERAL_STORE_ASSET_CARETAKER,
];

const myDeniedPrivileges = (myRole: Role) => {
  const deniedPrivileges: Record<Role, Role[]> = {} as Record<Role, Role[]>;
  for (const role of allRoles) {
    deniedPrivileges[role] = allRoles.filter(
      (r) => !myPrivileges[role].includes(r),
    );
  }
  return deniedPrivileges[myRole];
};

export const allExamTypes = Object.values(ExamType);
export const examTypes: Record<ExamType, string> = {
  ASSESSMENT: "Assessment",
  TEST: "Test",
  EXERCISE: "Exercise",
  EXAM: "Examination",
  MOCK: "Mock examination",
};
