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
    select: {
      id: true,
      user: {
        select: userDataSelect,
      },
    },
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
export const pupilDataInclude = {
  user: { select: userDataSelect },
  classStream: { include: classStreamDataInclude },
  fees: true,
} satisfies Prisma.PupilInclude;

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
            pupils: { include: pupilDataInclude },
            _count: { select: { pupils: true } },
          },
        },
      },
    },
  } satisfies Prisma.AcademicYearSelect;
};

export type PupilData = Prisma.PupilGetPayload<{
  include: typeof pupilDataInclude;
}>;

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

export type ClassTeacherWithYearData = Prisma.StaffGetPayload<{
  include: ReturnType<typeof getClassTeacherWithYearDataInclude>;
}>;

// Term
export const classTermDataSelect = {
  id: true,
  class: {
    select: {
      class: { include: classDataInclude },
      academicYear: { select: { year: true } },
      _count: { select: { streams: true } },
    },
  },
  term: { select: { term: true } },
  startAt: true,
  endAt: true,
  fees: {
    select: {
      term: true,
      feesPayments: true,
    },
  },
} satisfies Prisma.ClassTermSelect;

// Academic year
export const getTermWithYearDataSelect = (classTermId?: string) => {
  return {
    academicYearClasses: {
      select: {
        terms: {
          where: !classTermId ? {} : { id: classTermId },
          select: classTermDataSelect,
        },
      },
    },
  } satisfies Prisma.AcademicYearSelect;
};
export type TermWithYearData = Prisma.ClassTermGetPayload<{
  select: typeof classTermDataSelect;
}>;

// Miscellaneous
export type SearchParam = { [key: string]: string | string[] | undefined };
