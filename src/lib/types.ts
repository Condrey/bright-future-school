import { Prisma } from "@prisma/client";

//User
export const userDataSelect = {
  id: true,
  name: true,
  username: true,
  avatarUrl: true,
  email: true,
  telephone: true,
} satisfies Prisma.UserSelect;

//  Staff
export const staffDataInclude = {
  user: { select: { ...userDataSelect, role: true } },
} satisfies Prisma.StaffInclude;

export type StaffData = Prisma.StaffGetPayload<{
  include: typeof staffDataInclude;
}>;
//  Class Teacher
export const classTeacherDataInclude = {
  user: { select: { ...userDataSelect, role: true } },
  _count: { select: { classStreams: true } },
  classStreams: {
    select: {
      id: true,
      class: {
        select: {
          class: { select: { name: true, level: { select: { name: true } } } },
        },
      },
    },
  },
} satisfies Prisma.StaffInclude;
export type ClassTeacherData = Prisma.StaffGetPayload<{
  include: typeof classTeacherDataInclude;
}>;
export const classTeacherDataSelect = {
  id: true,
  user: {
    select: userDataSelect,
  },
} satisfies Prisma.StaffSelect;
export type ClassTeacherDataSelect = Prisma.StaffGetPayload<{
  include: typeof classTeacherDataSelect;
}>;
export const getClassTeacherWithYearDataInclude = (year: string) => {
  const data = {
    user: { select: { ...userDataSelect, role: true } },
    _count: { select: { classStreams: true } },
    classStreams: {
      select: {
        id: true,
        class: {
          select: {
            // class: { select: { name: true, level: { select: { name: true } } } },
            academicYear: {
              where: { year },
              select: {
                academicYearClasses: {
                  select: {
                    class: {
                      select: { name: true, level: { select: { name: true } } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  } satisfies Prisma.StaffInclude;
  return data;
};

// Dashboard params
export type DirectorDashboardParam = {
  classStreams: number;
  levels: number;
  classes: number;
  streams: number;
  academicYears: number;
  terms: number;
  pupils: number;
  teachingStaffs: number;
  nonTeachingStaffs: number;
};

// Class
export const classDataInclude = {
  level: true,
} satisfies Prisma.ClassInclude;

export type ClassData = Prisma.ClassGetPayload<{
  include: typeof classDataInclude;
}>;

// Level
export const levelDataInclude = {
  _count: { select: { classes: true } },
} satisfies Prisma.LevelInclude;

export type LevelData = Prisma.LevelGetPayload<{
  include: typeof levelDataInclude;
}>;

// Class streams
export const classStreamDataInclude = {
  _count: { select: { pupils: true } },
  classTeacher: {
    select: classTeacherDataSelect,
  },
  stream: true,
  class: {
    select: {
      academicYear: { select: { year: true } },
      class: {
        select: { id: true, name: true, level: { select: { name: true } } },
      },
    },
  },
} satisfies Prisma.classStreamInclude;

export type ClassStreamData = Prisma.classStreamGetPayload<{
  include: typeof classStreamDataInclude;
}>;

//Pupil
export const pupilDataInclude = (classTermId?: string) => {
  return {
    user: { select: {...userDataSelect,bio:true} },
    classStreams: { include: classStreamDataInclude },
    fees: {
      where: { termId: !classTermId ? {} : classTermId },
      select: feesDataSelect,
    },
  } satisfies Prisma.PupilInclude;
};

export const getPupilsWithYearDataInclude = (
  classId: string,
  streamId: string,
) => {
  return {
    academicYearClasses: {
      where: { classId },
      select: {
        streams: {
          where: { streamId },
          select: {
            pupils: {
              include: pupilDataInclude(),
              orderBy: { user: { name: "asc" } },
            },
            _count: { select: { pupils: true } },
          },
        },
      },
    },
  } satisfies Prisma.AcademicYearSelect;
};

export type PupilData = Prisma.PupilGetPayload<{
  include: ReturnType<typeof pupilDataInclude>;
}>;

export type ClassTeacherWithYearData = Prisma.StaffGetPayload<{
  include: ReturnType<typeof getClassTeacherWithYearDataInclude>;
}>;

// Fees payment
export const feesPaymentDataInclude = {
  paidBy: { select: userDataSelect },
} satisfies Prisma.FeesPaymentInclude;
export type FeesPaymentDataInclude = Prisma.FeesPaymentGetPayload<{
  include: typeof feesPaymentDataInclude;
}>;

//Fees
export const feesDataSelect = {
  term: true,
  feesPayments: {
    include: feesPaymentDataInclude,
    orderBy: { updatedAt: "desc" },
  },
  balance: true,
} satisfies Prisma.FeesSelect;
export type FeesDataSelect = Prisma.FeesGetPayload<{
  select: typeof feesDataSelect;
}>;

// Class term
export const classTermDataSelect = (classTermId?: string) => {
  return {
    id: true,
    classStreamId: true,
    termId: true,
    classStream: {
      include: {
        stream: { select: { name: true, id: true } },
        class: {
          select: {
            id: true,
            class: { include: classDataInclude },
            academicYear: { select: { year: true } },
            _count: { select: { streams: true } },
          },
        },
        classTeacher: { select: classTeacherDataSelect },
        pupils: {
          include: pupilDataInclude(classTermId),
          orderBy: { user: { name: "asc" } },
        },
        _count: { select: { pupils: true } },
      },
    },
    term: { select: { term: true } },
    startAt: true,
    endAt: true,
    feesAmount: true,
    fees: {
      select: feesDataSelect,
    },
  } satisfies Prisma.ClassTermSelect;
};

// Academic year
export const getTermWithYearDataSelect = (termId?: string) => {
  return {
    academicYearClasses: {
      select: {
        streams: {
          select: {
            terms: {
              where: !termId ? {} : { termId },
              select: classTermDataSelect(termId),
            },
          },
        },
      },
    },
  } satisfies Prisma.AcademicYearSelect;
};
export type TermWithYearData = Prisma.ClassTermGetPayload<{
  select: ReturnType<typeof classTermDataSelect>;
}>;

//////////////////////////// Asst Management '/////////////
export const assetDataInclude = {
  _count: {
    select: {
      computerLabItems: true,
      foodStoreItems: true,
      generalStoreItems: true,
      labItems: true,
      libraryBooks: true,
    },
  },
} satisfies Prisma.AssetInclude;
export type AssetData = Prisma.AssetGetPayload<{
  include: typeof assetDataInclude;
}>;

//Asset Repair Payments
export const assetRepairPaymentDataInclude = {
  receivedBy: { select: userDataSelect },
  assetDamage: true,
} satisfies Prisma.AssetRepairPaymentInclude;
export type AssetRepairPaymentData = Prisma.AssetRepairPaymentGetPayload<{
  include: typeof assetRepairPaymentDataInclude;
}>;

//Asset damages
export const assetDamageDataInclude = {
  damagedBy: { select: userDataSelect },
  assetRepairPayments: { select: { isSchoolCost: true, paidAmount: true } },
} satisfies Prisma.AssetDamageInclude;
export type AssetDamageData = Prisma.AssetDamageGetPayload<{
  include: typeof assetDamageDataInclude;
}>;

// Library
// Borrower
export const borrowerDataInclude = {
  user: { select: userDataSelect },
  libraryBook: {
    select: {
      isbn: true,
      libraryBook: { select: { title: true, author: true } },
    },
  },
} satisfies Prisma.BorrowerInclude;
export type BorrowerData = Prisma.BorrowerGetPayload<{
  include: typeof borrowerDataInclude;
}>;
export const individualLibraryBookDataInclude = {
  libraryBook: { include: { asset: true } },
  bookDamages: {
    orderBy: { createdAt: "desc" },
    include: assetDamageDataInclude,
  },
  borrowers: {
    orderBy: { borrowedAt: "desc" },
    include: borrowerDataInclude,
  },
  _count: { select: { bookDamages: true, borrowers: true } },
} satisfies Prisma.IndividualBookInclude;
export type IndividualLibraryBookData = Prisma.IndividualBookGetPayload<{
  include: typeof individualLibraryBookDataInclude;
}>;
export const libraryBookDataInclude = {
  asset: true,
  category: true,
  individualBooks: { include: individualLibraryBookDataInclude },
} satisfies Prisma.LibraryBookInclude;
export type LibraryBookData = Prisma.LibraryBookGetPayload<{
  include: typeof libraryBookDataInclude;
}>;
export type ModifiedLibData = IndividualLibraryBookData & {
  assetDamages: IndividualLibraryBookData["bookDamages"];
};
// Library book category
export const libraryBookCategoryDataInclude = {
  _count: { select: { libraryBooks: true } },
  libraryBooks: { select: { title: true, author: true, id: true } },
} satisfies Prisma.LibraryBookCategoryInclude;
export type LibraryBookCategoryData = Prisma.LibraryBookCategoryGetPayload<{
  include: typeof libraryBookCategoryDataInclude;
}>;

// Computer lab item
export const individualComputerLabItemDataInclude = {
  computerLabItem: { include: { asset: true } },
  assetDamages: {
    orderBy: { createdAt: "desc" },
    include: assetDamageDataInclude,
  },
  _count: { select: { assetDamages: true } },
} satisfies Prisma.IndividualComputerLabItemInclude;
export type IndividualComputerLabItemData =
  Prisma.IndividualComputerLabItemGetPayload<{
    include: typeof individualComputerLabItemDataInclude;
  }>;
export const computerLabItemDataInclude = {
  asset: true,
  individualComputerLabItems: {
    orderBy: [{ uniqueIdentifier: "asc" }, { createdAt: "desc" }],
    include: individualComputerLabItemDataInclude,
  },
} satisfies Prisma.ComputerLabItemInclude;
export type ComputerLabItemData = Prisma.ComputerLabItemGetPayload<{
  include: typeof computerLabItemDataInclude;
}>;

// Lab item
export const individualLaboratoryItemDataInclude = {
  labItem: { include: { asset: true } },
  assetDamages: {
    orderBy: { createdAt: "desc" },
    include: assetDamageDataInclude,
  },
  _count: { select: { assetDamages: true } },
} satisfies Prisma.IndividualLabItemInclude;
export type IndividualLaboratoryItemData = Prisma.IndividualLabItemGetPayload<{
  include: typeof individualLaboratoryItemDataInclude;
}>;
export const laboratoryItemDataInclude = {
  asset: true,
  individualLabItems: { include: individualLaboratoryItemDataInclude },
} satisfies Prisma.LabItemInclude;
export type LaboratoryItemData = Prisma.LabItemGetPayload<{
  include: typeof laboratoryItemDataInclude;
}>;

//General store
export const individualGeneralStoreItemDataInclude = {
  generalStoreItem: { include: { asset: true } },
  assetDamages: {
    orderBy: { createdAt: "desc" },
    include: assetDamageDataInclude,
  },
  _count: { select: { assetDamages: true } },
} satisfies Prisma.IndividualGeneralStoreItemInclude;
export type IndividualGeneralStoreItemData =
  Prisma.IndividualGeneralStoreItemGetPayload<{
    include: typeof individualGeneralStoreItemDataInclude;
  }>;
export const generalStoreItemDataInclude = {
  asset: true,
  individualGeneralStoreItems: {
    include: individualGeneralStoreItemDataInclude,
  },
} satisfies Prisma.GeneralStoreItemInclude;
export type GeneralStoreItemData = Prisma.GeneralStoreItemGetPayload<{
  include: typeof generalStoreItemDataInclude;
}>;

// Food store
export const foodStoreConsumptionDataInclude = {
  foodItem: { include: { supplier: true } },
} satisfies Prisma.FoodConsumptionInclude;
export type FoodStoreConsumptionData = Prisma.FoodConsumptionGetPayload<{
  include: typeof foodStoreConsumptionDataInclude;
}>;
export const individualFoodStoreItemDataInclude = {
  foodStoreItem: { include: { asset: true } },
  assetDamages: {
    orderBy: { createdAt: "desc" },
    include: assetDamageDataInclude,
  },
  _count: { select: { assetDamages: true } },
} satisfies Prisma.IndividualFoodStoreItemInclude;
export type IndividualFoodStoreItemData =
  Prisma.IndividualFoodStoreItemGetPayload<{
    include: typeof individualFoodStoreItemDataInclude;
  }>;
export const foodStoreItemDataInclude = {
  asset: true,
  supplier: true,
  individualFoodStoreItems: { include: individualFoodStoreItemDataInclude },
  consumptions: {
    orderBy: { dateUsedAt: "desc" },
    include: foodStoreConsumptionDataInclude,
  },
} satisfies Prisma.FoodStoreItemInclude;
export type FoodStoreItemData = Prisma.FoodStoreItemGetPayload<{
  include: typeof foodStoreItemDataInclude;
}>;
export const supplierDataInclude = {
  foodStoreItems: true,
} satisfies Prisma.SupplierInclude;
export type SupplierData = Prisma.SupplierGetPayload<{
  include: typeof supplierDataInclude;
}>;

// Miscellaneous
export type SearchParam = { [key: string]: string | string[] | undefined };
export type VandalismDamages = {
  damages: AssetDamageData[];
  item: {
    id: string;
    title: string;
    description?: string | null;
    uniqueIdentifier: string | null;
  };
}[];
