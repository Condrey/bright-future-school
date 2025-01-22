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
  user: { select: userDataSelect },
} satisfies Prisma.StaffInclude;

export type StaffData = Prisma.StaffGetPayload<{
  include: typeof staffDataInclude;
}>;
//  Class Teacher
export const classTeacherDataInclude = {
  user: { select: userDataSelect },
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
    user: { select: userDataSelect },
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
    user: { select: userDataSelect },
    classStream: { include: classStreamDataInclude },
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

// Miscellaneous
export type SearchParam = { [key: string]: string | string[] | undefined };
